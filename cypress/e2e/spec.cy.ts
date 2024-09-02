const modalContent = '[data-cy=modal-content]';
const closeModalButton = '[data-cy=modal-content] button[type=button]';
const constructor = '[data-cy=constructor]';
const constructorIngredients = '[data-cy=constructor-ingredients]';
const buns = '[data-cy=buns]';
const mains = '[data-cy=mains]';
const sauces = '[data-cy=sauces]';
const ingredients = '[data-cy=ingredients]';

describe('Блок E2E тестов>', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1280, 800);
    cy.visit('/');
  });

  describe('Добавление ингредиента в конструктор', () => {
    it('Добавление булки в конструктор', () => {
      cy.testAdd(buns, 'Добавить')
      cy.testExist('[data-cy=constructor-bun-top]', 'Булка 1')
      cy.testExist('[data-cy=constructor-bun-bottom]', 'Булка 1')
    });

    it('Добавление начинки в конструктор', () => {
      cy.testAdd(mains, 'Добавить')
      cy.testExist(constructorIngredients, 'Ингредиент 1')
    });

    it('Добавление соуса в конструктор', () => {
      cy.testAdd(sauces, 'Добавить')
      cy.testExist(constructorIngredients, 'Соус 1')
    });
  });

  describe('Работа модального окна', () => {
    it('Тест открытия модального окна с деталями ингредиента', () => {
      cy.get(modalContent).should('not.exist');
      cy.testAdd(ingredients, 'Булка 1')
      cy.testAdd(modalContent, 'Булка 1')
    });

    it('Тест закрытия модального окна по клику на кнопку Х', () => {
      cy.testAdd(ingredients, 'Булка 1')
      cy.testExist(modalContent, 'Булка 1')
      cy.get(closeModalButton).click();
      cy.get(modalContent).should('not.exist');
    });

    it('Тест закрытия модального окна по клику на оверлей', () => {
      cy.testAdd(ingredients, 'Булка 1')
      cy.testExist(modalContent, 'Булка 1')
      cy.get('[data-cy=modal-overlay]').click('top', { force: true });
      cy.get(modalContent).should('not.exist');
    });
  });

  describe('Создание и отправка заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', 'api/auth/user', { fixture: 'userData.json' });
      cy.intercept('POST', 'api/orders', { fixture: 'userOrder.json' }).as(
        'postOrder'
      );

      window.localStorage.setItem('refreshToken', JSON.stringify('123456789'));
      cy.setCookie('accessToken', JSON.stringify('987654321'));
    });

    afterEach(() => {
      cy.clearCookie('refreshToken');
      cy.clearCookie('accessToken');
    });

    it('Тест добавления ингредиентов и отправки заказа', () => {
      // добавляем ингредиенты, оформляем заказ
      cy.testAdd(buns, 'Добавить')
      cy.testAdd(mains, 'Добавить')
      cy.testAdd(sauces, 'Добавить')
      cy.get('[data-cy=order-total] button').click();

      // проверка состава добавленных игредиентов в принятом заказе
      cy.wait('@postOrder')
        .its('request.body')
        .should('deep.equal', {
          ingredients: ['1', '2', '4', '1']
        });

      // проверяем номер заказа
      cy.get(modalContent).contains('12345').should('exist');

      // закрываем модальное окно и проверяем что модалки нет
      cy.get(closeModalButton).click();
      cy.get(modalContent).should('not.exist');
      
      // проверяем, что конструктор очищен от булок и начинки
      cy.get(constructor).as('constructor');
      cy.get('@constructor').contains('Булка 1').should('not.exist');
      cy.get('@constructor').contains('Ингредиент 1').should('not.exist');
      cy.get('@constructor').contains('Соус 1').should('not.exist');
    });
  });
});
