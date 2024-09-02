import { rootReducer, store } from './store';

describe('rootReducer', () => {
  test('Тестирование работы rootReducer', () => {
    const testAction = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, testAction);

    expect(state).toEqual(store.getState());
  });
});