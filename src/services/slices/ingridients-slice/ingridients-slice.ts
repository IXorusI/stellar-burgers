import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SliceName, RequestStatus, TIngredient } from '@utils-types';
import * as burgerApi from '@api';

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { extra: typeof burgerApi }
>(
  `${SliceName.ingredients}/fetchIngredients`,
  async (_, { extra: api }) => await api.getIngredientsApi()
);

export type TIngredientState = {
  ingredients: TIngredient[];
  currentIngredient: TIngredient | null;
  requestStatus: RequestStatus;
  error: string | null;
};

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
      .addCase(fetchIngredients.pending, (state) => {
        state.requestStatus = RequestStatus.loading;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.requestStatus = RequestStatus.error;
        state.error = action.error.message || 'Произошла ошибка';
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
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
