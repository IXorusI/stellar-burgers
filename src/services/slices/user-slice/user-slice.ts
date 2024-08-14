import {
  TLoginData,
  TRegisterData,
  TUserResponse,
  TServerResponse,
  loginUserApi,
  registerUserApi
} from '@api';
import {
  createSlice,
  createAsyncThunk,
  SerializedError
} from '@reduxjs/toolkit';
import { RequestStatus, SliceName, TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../../utils/cookie';
import {
  isActionPending,
  isActionRejected
} from '../../../utils/check-type-action';
import * as burgerApi from '@api';

export const checkUserAuth = createAsyncThunk<
  TUserResponse,
  void,
  { extra: typeof burgerApi }
>(
  `${SliceName.user}/checkUserAuth`,
  async (_, { extra: api }) => await api.getUserApi()
);

export const fetchLoginUser = createAsyncThunk(
  `${SliceName.user}/fetchLoginUser`,
  async (userData: TLoginData) => {
    try {
      const result = await loginUserApi(userData);
      localStorage.setItem('refreshToken', result.refreshToken);
      setCookie('accessToken', result.accessToken);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export const fetchLogoutUser = createAsyncThunk<
  TServerResponse<{}>,
  void,
  { extra: typeof burgerApi }
>(`${SliceName.user}/fetchLogoutUser`, async (_, { extra: api }) => {
  try {
    const result = await api.logoutApi();
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
    return result;
  } catch (error) {
    return Promise.reject(error);
  }
});

export const fetchUpdateUserData = createAsyncThunk<
  TUserResponse,
  Partial<TRegisterData>,
  { extra: typeof burgerApi }
>(
  `${SliceName.user}/fetchUpdateUserData`,
  async (userData, { extra: api }) => await api.updateUserApi(userData)
);

export const fetchRegisterUser = createAsyncThunk(
  `${SliceName.user}/fetchRegisterUser`,
  registerUserApi
);

export type TUserState = {
  isAuthChecked: boolean;
  userData: TUser | null;
  error: SerializedError | null;
  requestStatus: RequestStatus;
};

const initialState: TUserState = {
  isAuthChecked: false,
  userData: null,
  requestStatus: RequestStatus.idle,
  error: null
};

const userSlice = createSlice({
  name: SliceName.user,
  initialState,
  reducers: {
    authCheck: (state) => {
      state.isAuthChecked = true;
    }
  },
  selectors: {
    isAuthCheckedSelector: (sliceState) => sliceState.isAuthChecked,
    getError: (sliceState) => sliceState.error,
    userDataSelector: (sliceState) => sliceState.userData
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.userData = action.payload.user;
        state.requestStatus = RequestStatus.success;
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        state.requestStatus = RequestStatus.success;
      })
      .addCase(fetchLogoutUser.fulfilled, (state) => {
        state.userData = null;
        state.requestStatus = RequestStatus.success;
      })
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        state.requestStatus = RequestStatus.success;
      })
      .addCase(fetchUpdateUserData.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        state.requestStatus = RequestStatus.success;
      })
      .addMatcher(isActionPending(SliceName.order), (state) => {
        state.requestStatus = RequestStatus.loading;
      })
      .addMatcher(isActionRejected(SliceName.order), (state) => {
        state.requestStatus = RequestStatus.error;
      });
  }
});

export const { authCheck } = userSlice.actions;
export const { isAuthCheckedSelector, userDataSelector, getError } =
  userSlice.selectors;

export default userSlice;
