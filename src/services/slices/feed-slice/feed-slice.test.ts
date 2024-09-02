import { RequestStatus } from '../../../utils/types';
import { fetchFeeds, initialState } from '../feed-slice/feed-slice';
import { feedsReducer } from '..';

const feedsData = {
  success: true,
  total: 42680,
  totalToday: 123,
  orders: [
    {
      _id: '667046f2856777001bb1b962',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa093c'
      ],
      status: 'done',
      name: 'Краторный био-марсианский бургер',
      createdAt: '2024-06-17T14:23:46.718Z',
      updatedAt: '2024-06-17T14:23:47.197Z',
      number: 43054
    },
    {
      _id: '667045e7856777001bb1b95c',
      ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093d'],
      status: 'done',
      name: 'Флюоресцентный бургер',
      createdAt: '2024-06-17T14:19:19.371Z',
      updatedAt: '2024-06-17T14:19:19.794Z',
      number: 43053
    }
  ]
};

describe('Тестирование работы среза ленты заказов', () => {
  it('проверка изменения статуса запроса при pending', () => {
    const currentState = feedsReducer(initialState, fetchFeeds.pending(''));

    expect(currentState).toEqual({
      ...initialState,
      requestStatus: RequestStatus.loading
    });
  });

  it('проверка изменения статуса запроса и сохранения заказов в стор при fulfilled', () => {
    const currentState = feedsReducer(
      {
        ...initialState,
        requestStatus: RequestStatus.loading
      },
      fetchFeeds.fulfilled(feedsData, '')
    );

    expect(currentState).toEqual({
      ...initialState,
      orders: feedsData.orders,
      total: feedsData.total,
      totalToday: feedsData.totalToday,
      requestStatus: RequestStatus.success
    });
  });
});