import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { userDataSelector } from '../../services/slices/user-slice/user-slice';

export const AppHeader: FC = () => {
  const userData = useSelector(userDataSelector);
  return <AppHeaderUI userName={userData?.name} />;
};
