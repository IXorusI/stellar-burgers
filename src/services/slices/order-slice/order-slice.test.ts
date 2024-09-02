import { RequestStatus } from '../../../utils/types';
import {
  TOrderState,
  getOrderData,
  getUserOrders,
  fetchOrderBurger,
  clearOrderData
} from '../order-slice/order-slice';
import { orderReducer } from '..';

const mockOrders = {
  success: true,
  orders: [
    {
      _id: 'test_id',
      ingredients: [
        'test_ingredient_1',
        'test_ingredient_2',
        'test_ingredient_3'
      ],
      owner: 'test_owner',
      status: 'done',
      name: 'Space флюоресцентный бургер',
      createdAt: '',
      updatedAt: '',
      number: 55155,
      __v: 0
    },
    {
      _id: 'test_id',
      ingredients: [
        'test_ingredient_1',
        'test_ingredient_2',
        'test_ingredient_3'
      ],
      owner: 'test_owner',
      status: 'done',
      name: 'Space флюоресцентный бургер',
      createdAt: '',
      updatedAt: '',
      number: 55155,
      __v: 0
    },
    {
      _id: 'test_id',
      ingredients: [
        'test_ingredient_1',
        'test_ingredient_2',
        'test_ingredient_3'
      ],
      owner: 'test_owner',
      status: 'done',
      name: 'Space флюоресцентный бургер',
      createdAt: '',
      updatedAt: '',
      number: 55155,
      __v: 0
    }
  ]
};

const mockUserOrder = {
  success: true,
  order: {
    _id: 'test_i',
    ingredients: [
      'test_ingredient_1',
      'test_ingredient_2',
      'test_ingredient_3'
    ],
    owner: 'test_owner',
    status: 'done',
    name: 'Space флюоресцентный бургер',
    createdAt: '',
    updatedAt: '',
    number: 55155,
    __v: 0
  },
  name: 'Space флюоресцентный бургер'
};

const mockIdIngredients = ['111', '222', '333'];

describe('Тестирование работы среза заказов пользователя', () => {
  const initialState: TOrderState = {
    orderData: null,
    userOrders: [],
    orderRequest: false,
    orderModalData: null,
    requestStatus: RequestStatus.idle
  };

  it('проверка загрузки данных о заказе при fulfilled', () => {
    const currentState = orderReducer(
      {
        ...initialState,
        requestStatus: RequestStatus.loading
      },
      getOrderData.fulfilled(mockOrders, '', 12345)
    );

    expect(currentState).toEqual({
      ...initialState,
      orderData: mockOrders.orders[0],
      requestStatus: RequestStatus.success
    });
  });

  it('проверка загрузки данных о заказах пользователя при fulfilled', () => {
    const currentState = orderReducer(
      {
        ...initialState,
        requestStatus: RequestStatus.loading
      },
      getUserOrders.fulfilled(mockOrders.orders, '')
    );

    expect(currentState).toEqual({
      ...initialState,
      userOrders: mockOrders.orders,
      requestStatus: RequestStatus.success
    });
  });

  it('проверка записи данных о заказе в стор при fulfilled', () => {
    const currentState = orderReducer(
      {
        ...initialState,
        orderRequest: true,
        requestStatus: RequestStatus.loading
      },
      fetchOrderBurger.fulfilled(mockUserOrder, '', mockIdIngredients)
    );

    expect(currentState).toEqual({
      ...initialState,
      orderModalData: mockUserOrder.order,
      requestStatus: RequestStatus.success,
      orderRequest: false
    });
  });

  it('проверка изменения статуса запроса отправки заказа при pending', () => {
    const currentState = orderReducer(
      initialState,
      fetchOrderBurger.pending('', mockIdIngredients)
    );

    expect(currentState).toEqual({
      ...initialState,
      requestStatus: RequestStatus.loading,
      orderRequest: true
    });
  });

  it('проверка очистки данных заказа', () => {
    const currentState = orderReducer(
      { ...initialState, orderData: mockUserOrder.order },
      clearOrderData()
    );

    expect(currentState).toEqual({
      ...initialState,
      orderData: null
    });
  });
});