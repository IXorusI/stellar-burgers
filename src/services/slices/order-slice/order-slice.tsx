import { TOrderResponse, TNewOrderResponse } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RequestStatus, SliceName, TOrder } from '@utils-types';
import {
  isActionPending,
  isActionRejected
} from '../../../utils/check-type-action';
import * as burgerApi from '@api';

export const getOrderData = createAsyncThunk<
  TOrderResponse,
  number,
  { extra: typeof burgerApi }
>(
  `${SliceName.order}/getOrderData`,
  async (orderNumber, { extra: api }) =>
    await api.getOrderByNumberApi(orderNumber)
);

export const getUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { extra: typeof burgerApi }
>(
  `${SliceName.order}/getUserOrders`,
  async (_, { extra: api }) => await api.getOrdersApi()
);

export const fetchOrderBurger = createAsyncThunk<
  TNewOrderResponse,
  string[],
  { extra: typeof burgerApi }
>(
  `${SliceName.order}/fetchOrderBurger`,
  async (orderData, { extra: api }) => await api.orderBurgerApi(orderData)
);

export type TOrderState = {
  orderData: TOrder | null;
  userOrders: TOrder[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  requestStatus: RequestStatus;
};

const initialState: TOrderState = {
  orderData: null,
  userOrders: [],
  orderRequest: false,
  orderModalData: null,
  requestStatus: RequestStatus.idle
};

const orderSlice = createSlice({
  name: SliceName.order,
  initialState,
  reducers: {
    clearOrderData: (state) => {
      state.orderData = initialState.orderData;
    },
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    }
  },
  selectors: {
    selectOrderData: (sliceState) => sliceState.orderData,
    selectUserOrders: (sliceState) => sliceState.userOrders,
    selectRequest: (sliceState) => sliceState.orderRequest,
    requestStatus: (sliceState) => sliceState.requestStatus,
    selectModalData: (sliceState) => sliceState.orderModalData
  },
  extraReducers: (builder) => {
    builder
      // ---------------OrderData --------------------//
      .addCase(getOrderData.fulfilled, (state, action) => {
        state.orderData = action.payload.orders[0];
        state.requestStatus = RequestStatus.success;
      })
      // ---------------userOrders --------------------//
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
        state.requestStatus = RequestStatus.success;
      })
      // ---------------orderBurger --------------------//
      .addCase(fetchOrderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(fetchOrderBurger.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(fetchOrderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
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

export const { clearOrderData, clearOrderModalData } = orderSlice.actions;
export const {
  selectOrderData,
  selectUserOrders,
  selectRequest,
  selectModalData,
  requestStatus
} = orderSlice.selectors;

export default orderSlice;
