import {
  orderBurgerApi,
  getOrderByNumberApi,
  getOrdersApi
} from '../../../utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RequestStatus, SliceName, TOrder } from '../../../utils/types';

export type TOrderState = {
  orderData: TOrder | null;
  userOrders: TOrder[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  requestStatus: RequestStatus;
};

export const getOrderData = createAsyncThunk(
  `${SliceName.order}/getOrderData`,
  async (orderNumber: number) => await getOrderByNumberApi(orderNumber)
);

export const getUserOrders = createAsyncThunk(
  `${SliceName.order}/getUserOrders`,
  async () => await getOrdersApi()
);

export const fetchOrderBurger = createAsyncThunk('order/post', orderBurgerApi);

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
      .addCase(getOrderData.fulfilled, (state, action) => {
        state.orderData = action.payload.orders[0];
        state.requestStatus = RequestStatus.success;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
        state.requestStatus = RequestStatus.success;
      })
      .addCase(fetchOrderBurger.pending, (state) => {
        state.orderRequest = true;
        state.requestStatus = RequestStatus.loading;
      })
      .addCase(fetchOrderBurger.rejected, (state) => {
        state.orderRequest = false;
        state.requestStatus = RequestStatus.error;
      })
      .addCase(fetchOrderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.requestStatus = RequestStatus.success;
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
