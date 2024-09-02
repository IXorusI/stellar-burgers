import {
    TBurgerConstructorState,
    addIngredient,
    deleteIngredient,
    moveUpIngredient,
    moveDownIngredient,
    clearConstructorItems,
    initialState
  } from '../burger-constructor-slice/burger-constructor-slice';
  import { burgerConstructorReducer } from '..';
  
  const bun = {
    calories: 100,
    carbohydrates: 10,
    fat: 50,
    image: 'bun-01.png',
    image_large: 'bun-01-large.png',
    image_mobile: 'bun-01-mobile.png',
    name: 'Булка 1',
    price: 1000,
    proteins: 100,
    type: 'bun',
    __v: 0,
    _id: '1'
  };
  
  const ingredient1 = {
    calories: 200,
    carbohydrates: 20,
    fat: 100,
    image: 'meat-01.png',
    image_large: 'meat-01-large.png',
    image_mobile: 'meat-01-mobile.png',
    name: 'Ингредиент 1',
    price: 500,
    proteins: 500,
    type: 'main',
    __v: 0,
    _id: '2'
  };
  
  const ingredient2 = {
    calories: 300,
    carbohydrates: 30,
    fat: 150,
    image: 'sauce-01.png',
    image_large: 'sauce-01-large.png',
    image_mobile: 'sauce-01-mobile.png',
    name: 'Ингредиент 2',
    price: 100,
    proteins: 500,
    type: 'main',
    __v: 0,
    _id: '3'
  };
  
  describe('Тестирование работы слайса конструктора бургера', () => {
    it('проверка добавления булки', () => {
      const currentState = burgerConstructorReducer(
        initialState,
        addIngredient(bun)
      );
  
      expect(currentState.constructorItems.bun).toEqual({
        ...bun,
        id: expect.any(String)
      });
    });
  
    it('проверка добавления начинки', () => {
      const currentState = burgerConstructorReducer(
        initialState,
        addIngredient(ingredient1)
      );
  
      expect(currentState.constructorItems.ingredients[0]).toEqual({
        ...ingredient1,
        id: expect.any(String)
      });
    });
  
    it('проверка удаления начинки', () => {
      const initialState: TBurgerConstructorState = {
        constructorItems: {
          bun: null,
          ingredients: [{ ...ingredient1, id: '1' }]
        }
      };
  
      const currentState = burgerConstructorReducer(
        initialState,
        deleteIngredient(0)
      );
  
      expect(currentState.constructorItems.ingredients).toEqual([]);
    });
  
    it('проверка перемещения ингредиента вверх', () => {
      const initialState: TBurgerConstructorState = {
        constructorItems: {
          bun: null,
          ingredients: [
            { ...ingredient1, id: '1' },
            { ...ingredient2, id: '2' }
          ]
        }
      };
  
      const currentState = burgerConstructorReducer(
        initialState,
        moveUpIngredient(1)
      );
  
      expect(currentState.constructorItems.ingredients).toEqual([
        { ...ingredient2, id: '2' },
        { ...ingredient1, id: '1' }
      ]);
    });
  
    it('проверка перемещения ингредиента вниз', () => {
      const initialState: TBurgerConstructorState = {
        constructorItems: {
          bun: null,
          ingredients: [
            { ...ingredient1, id: '1' },
            { ...ingredient2, id: '2' }
          ]
        }
      };
  
      const currentState = burgerConstructorReducer(
        initialState,
        moveDownIngredient(0)
      );
  
      expect(currentState.constructorItems.ingredients).toEqual([
        { ...ingredient2, id: '2' },
        { ...ingredient1, id: '1' }
      ]);
    });
  
    it('проверка перемещения ингредиента вниз', () => {
      const initialState: TBurgerConstructorState = {
        constructorItems: {
          bun: bun,
          ingredients: [
            { ...ingredient1, id: '1' },
            { ...ingredient2, id: '2' }
          ]
        }
      };
  
      const currentState = burgerConstructorReducer(
        initialState,
        clearConstructorItems()
      );
  
      expect(currentState.constructorItems).toEqual({
        bun: null,
        ingredients: []
      });
    });
  });