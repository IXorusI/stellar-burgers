import { getIngredientsApi } from '../../../utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SliceName, RequestStatus, TIngredient } from '../../../utils/types';

export type TIngredientState = {
  ingredients: TIngredient[];
  requestStatus: RequestStatus;
  error: string | null;
};

export const getIngridients = createAsyncThunk(
  `${SliceName.ingredients}/getIngridients`,
  getIngredientsApi
);

const initialState: TIngredientState = {
  ingredients: [],
  requestStatus: RequestStatus.success,
  error: null
};

const ingredientsSlice = createSlice({
  name: SliceName.ingredients,
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectRequestStatus: (state) => state.requestStatus,
    selectIngredient: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngridients.pending, (state) => {
        state.requestStatus = RequestStatus.loading;
        state.error = null;
      })
      .addCase(getIngridients.rejected, (state, action) => {
        state.requestStatus = RequestStatus.error;
        state.error = action.error.message || 'Произошла ошибка';
      })
      .addCase(getIngridients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.requestStatus = RequestStatus.success;
        state.error = null;
      });
  }
});

export const { selectIngredients, selectRequestStatus, selectIngredient } =
  ingredientsSlice.selectors;

export default ingredientsSlice;
