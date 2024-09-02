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
      _id: '66714250856777001bb1bc6e',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa0943',
        '643d69a5c3f7b9001cfa0943'
      ],
      owner: '662f5b4197ede0001d0681b1',
      status: 'done',
      name: 'Space флюоресцентный бургер',
      createdAt: '2024-06-18T08:16:16.087Z',
      updatedAt: '2024-06-18T08:16:16.539Z',
      number: 43189,
      __v: 0
    },
    {
      _id: '66714250856777001bb1bc6e',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa0943',
        '643d69a5c3f7b9001cfa0943'
      ],
      owner: '662f5b4197ede0001d0681b1',
      status: 'done',
      name: 'Space флюоресцентный бургер',
      createdAt: '2024-06-18T08:16:16.087Z',
      updatedAt: '2024-06-18T08:16:16.539Z',
      number: 43189,
      __v: 0
    },
    {
      _id: '66714250856777001bb1bc6e',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa0943',
        '643d69a5c3f7b9001cfa0943'
      ],
      owner: '662f5b4197ede0001d0681b1',
      status: 'done',
      name: 'Space флюоресцентный бургер',
      createdAt: '2024-06-18T08:16:16.087Z',
      updatedAt: '2024-06-18T08:16:16.539Z',
      number: 43189,
      __v: 0
    }
  ]
};

const mockUserOrder = {
  success: true,
  order: {
    _id: '66714250856777001bb1bc6e',
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa0943',
      '643d69a5c3f7b9001cfa0943'
    ],
    owner: '662f5b4197ede0001d0681b1',
    status: 'done',
    name: 'Space флюоресцентный бургер',
    createdAt: '2024-06-18T08:16:16.087Z',
    updatedAt: '2024-06-18T08:16:16.539Z',
    number: 43189,
    __v: 0
  },
  name: 'Space флюоресцентный бургер'
};

const mockIdIngredients = ['11111', '2222', '3333'];

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
      getOrderData.fulfilled(mockOrders, '', 123456)
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