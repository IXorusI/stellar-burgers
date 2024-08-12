import * as burgerApi from '@api';
import { TFeedsResponse } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RequestStatus, SliceName, TOrder } from '@utils-types';

export const fetchFeeds = createAsyncThunk<
  TFeedsResponse,
  void,
  { extra: typeof burgerApi }
>(
  `${SliceName.feeds}/fetchFeeds`,
  async (_, { extra: api }) => await api.getFeedsApi()
);

export type TFeedState = {
  orders: TOrder[];
  total: number | null;
  totalToday: number | null;
  requestStatus: RequestStatus;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  requestStatus: RequestStatus.idle
};

const feedsSlice = createSlice({
  name: SliceName.feeds,
  initialState,
  reducers: {},
  selectors: {
    selectOrders: (sliceState) => sliceState.orders,
    selectOrdersTotal: (sliceState) => sliceState.total,
    selectOrdersTotalToday: (sliceState) => sliceState.totalToday
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.requestStatus = RequestStatus.loading;
      })
      .addCase(fetchFeeds.rejected, (state) => {
        state.requestStatus = RequestStatus.error;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.requestStatus = RequestStatus.success;
      });
  }
});

export const { selectOrders, selectOrdersTotal, selectOrdersTotalToday } =
  feedsSlice.selectors;

export default feedsSlice;
