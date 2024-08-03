import { getIngredientsApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SliceName, RequestStatus, TIngredient } from '@utils-types';

export type TIngredientState = {
  ingredients: TIngredient[];
  currentIngredient: TIngredient | null;
  requestStatus: RequestStatus;
  error: string | null;
};

export const getIngridients = createAsyncThunk('ingridients/getAll', async () =>
  getIngredientsApi()
);

const initialState: TIngredientState = {
  ingredients: [],
  currentIngredient: null,
  requestStatus: RequestStatus.idle,
  error: null
};

const ingredientsSlice = createSlice({
  name: SliceName.ingredients,
  initialState,
  reducers: {
    setIngredient: (state, action) => {
      state.currentIngredient =
        state.ingredients.find(
          (ingredient) => ingredient._id === action.payload
        ) || null;
    }
  },
  selectors: {
    selectIngredients: (sliceState) => sliceState.ingredients,
    selectRequestStatus: (sliceState) => sliceState.requestStatus,
    selectIngredient: (sliceState) => sliceState.currentIngredient
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

export const { setIngredient } = ingredientsSlice.actions;
export const { selectIngredients, selectRequestStatus, selectIngredient } =
  ingredientsSlice.selectors;

export default ingredientsSlice;
