import burgerConstructorSlice from '../slices/burger-constructor-slice/burger-constructor-slice';
import feedsSlice from '../slices/feed-slice/feed-slice';
import ingredientsSlice from '../slices/ingridients-slice/ingridients-slice';
import orderSlice from '../slices/order-slice/order-slice';
import userSlice from '../slices/user-slice/user-slice';

export const ingredientsReducer = ingredientsSlice.reducer;
export const burgerConstructorReducer = burgerConstructorSlice.reducer;
export const feedsReducer = feedsSlice.reducer;
export const orderReducer = orderSlice.reducer;
export const userReducer = userSlice.reducer;