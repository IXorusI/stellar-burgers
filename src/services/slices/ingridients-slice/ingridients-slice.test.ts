import { RequestStatus } from '../../../utils/types';
import {
  TIngredientState,
  getIngridients
} from '../../slices/ingridients-slice/ingridients-slice';
import { ingredientsReducer } from '..';

const ingredientsData = [
  {
    calories: 420,
    carbohydrates: 53,
    fat: 24,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    name: 'Булка 1',
    price: 1255,
    proteins: 80,
    type: 'bun',
    __v: 0,
    _id: '1'
  },
  {
    calories: 4242,
    carbohydrates: 242,
    fat: 142,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    name: 'Ингредиент 1',
    price: 424,
    proteins: 420,
    type: 'main',
    __v: 0,
    _id: '2'
  }
];

describe('Тестирование работы слайса ингредиентов', () => {
  const initialState: TIngredientState = {
    ingredients: [],
    requestStatus: RequestStatus.idle,
    error: null
  };

  it('проверка изменения статуса запроса и ошибки при pending', () => {
    const currentState = ingredientsReducer(
      { ...initialState, error: 'Error message' },
      getIngridients.pending('')
    );

    expect(currentState).toEqual({
      ...initialState,
      requestStatus: RequestStatus.loading,
      error: null
    });
  });

  it('проверка изменения статуса запроса и ошибки при rejected', () => {
    const currentState = ingredientsReducer(
      { ...initialState, requestStatus: RequestStatus.loading },
      getIngridients.rejected(new Error('Error message'), '')
    );

    expect(currentState).toEqual({
      ...initialState,
      requestStatus: RequestStatus.error,
      error: 'Error message'
    });
  });

  it('проверка изменения статуса запроса, ошибки, сохранения ингредиентов при fulfilled', () => {
    const currentState = ingredientsReducer(
      {
        ...initialState,
        error: 'Error message',
        requestStatus: RequestStatus.loading
      },
      getIngridients.fulfilled(ingredientsData, '')
    );

    expect(currentState).toEqual({
      ...initialState,
      ingredients: ingredientsData,
      requestStatus: RequestStatus.success,
      error: null
    });
  });
});