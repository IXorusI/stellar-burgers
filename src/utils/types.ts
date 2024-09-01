export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

export type TConstructorIngredient = TIngredient & {
  id: string;
};

export type TOrder = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TUser = {
  email: string;
  name: string;
};

export const enum RequestStatus {
  idle = 'idle',
  loading = 'loading',
  success = 'success',
  error = 'error'
}

export const enum SliceName {
  order = 'order',
  user = 'user',
  burgerConstructor = 'burger-constructor',
  feeds = 'feeds',
  ingredients = 'ingredients'
}

export type TTabMode = 'bun' | 'sauce' | 'main';
