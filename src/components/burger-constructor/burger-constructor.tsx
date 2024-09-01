/** TODO: Допилить до чистового варианта */

import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router';
import {
  clearConstructorItems,
  selectConstructorItems
} from '../../services/slices/burger-constructor-slice/burger-constructor-slice';
import {
  clearOrderModalData,
  fetchOrderBurger,
  selectModalData,
  selectRequest
} from '../../services/slices/order-slice/order-slice';
import { userDataSelector } from '../../services/slices/user-slice/user-slice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectRequest);
  const orderModalData = useSelector(selectModalData);
  const user = useSelector(userDataSelector);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) return navigate(`/login`);

    const bunId = constructorItems.bun._id;
    const ingredientsId = constructorItems.ingredients.reduce(
      (acc: string[], ingredient) => [...acc, ingredient._id],
      []
    );

    const orderData = [bunId, ...ingredientsId, bunId];

    dispatch(fetchOrderBurger(orderData)).finally(() =>
      dispatch(clearConstructorItems())
    );
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModalData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, val: TConstructorIngredient) => sum + val.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
