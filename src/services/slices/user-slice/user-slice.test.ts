import { RequestStatus } from '../../../utils/types';
import {
  TUserState,
  checkUserAuth,
  fetchLoginUser,
  fetchLogoutUser,
  fetchUpdateUserData,
  fetchRegisterUser
} from '../user-slice/user-slice';
import { userReducer } from '..';

const mockUserRes = {
  success: true,
  user: {
    name: 'testName',
    email: 'testEmail@yandex.ru',
    password: 'testPassword'
  }
};

const mockAuthResponse = {
  success: true,
  refreshToken: 'refreshToken',
  accessToken: 'accessToken',
  user: {
    name: 'testName',
    email: 'testEmail@yandex.ru',
    password: 'testPassword'
  }
};

describe('Тестирование работы среза заказов пользователя', () => {
  const initialState: TUserState = {
    isAuthChecked: false,
    userData: null,
    error: null,
    requestStatus: RequestStatus.idle
  };

  it('проверка загрузки данных о заказе при fulfilled', () => {
    const currentState = userReducer(
      {
        ...initialState,
        requestStatus: RequestStatus.loading
      },
      checkUserAuth.fulfilled(mockUserRes, '')
    );

    expect(currentState).toEqual({
      ...initialState,
      userData: mockUserRes.user,
      isAuthChecked: true,
      requestStatus: RequestStatus.success
    });
  });

  it('проверка сохранения данных пользователя при логине', () => {
    const currentState = userReducer(
      {
        ...initialState,
        requestStatus: RequestStatus.loading
      },
      fetchLoginUser.fulfilled(mockAuthResponse, '', {
        email: 'testEmail@yandex.ru',
        password: 'testPassword'
      })
    );

    expect(currentState).toEqual({
      ...initialState,
      userData: mockAuthResponse.user,
      requestStatus: RequestStatus.success
    });
  });

  it('проверка очистки данных пользователя при логауте', () => {
    const currentState = userReducer(
      {
        ...initialState,
        requestStatus: RequestStatus.loading
      },
      fetchLogoutUser.fulfilled(mockAuthResponse, '')
    );

    expect(currentState).toEqual({
      ...initialState,
      userData: null,
      requestStatus: RequestStatus.success
    });
  });

  it('проверка сохранения данных пользователя при регистрации', () => {
    const currentState = userReducer(
      {
        ...initialState,
        requestStatus: RequestStatus.loading
      },
      fetchRegisterUser.fulfilled(mockAuthResponse, '', {
        email: 'testEmail@yandex.ru',
        password: 'testPassword',
        name: 'testName'
      })
    );

    expect(currentState).toEqual({
      ...initialState,
      userData: mockAuthResponse.user,
      requestStatus: RequestStatus.success
    });
  });

  it('проверка сохранение данных пользователя при обновлении в ЛК', () => {
    const currentState = userReducer(
      {
        ...initialState,
        requestStatus: RequestStatus.loading
      },
      fetchUpdateUserData.fulfilled(mockUserRes, '', {
        email: 'testEmail@yandex.ru',
        password: 'testPassword',
      })
    );

    expect(currentState).toEqual({
      ...initialState,
      userData: mockUserRes.user,
      requestStatus: RequestStatus.success
    });
  });
});