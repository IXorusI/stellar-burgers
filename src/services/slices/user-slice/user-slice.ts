import {
  TLoginData,
  logoutApi,
  loginUserApi,
  registerUserApi,
  updateUserApi,
  getUserApi
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

export const checkUserAuth = createAsyncThunk(
  `${SliceName.user}/checkUserAuth`,
  async () => await getUserApi()
);

export const fetchLoginUser = createAsyncThunk(
  `${SliceName.user}/fetchLoginUser`,
  async (userData: TLoginData) => {
    try {
      const result = await loginUserApi(userData);
      setCookie('accessToken', result.accessToken);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export const fetchLogoutUser = createAsyncThunk(
  `${SliceName.user}/fetchLogoutUser`,
  async () => {
    try {
      const result = await logoutApi();
      deleteCookie('accessToken');
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export const fetchUpdateUserData = createAsyncThunk(
  `${SliceName.user}/fetchUpdateUserData`,
  async (userData: TLoginData) => await updateUserApi(userData)
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
