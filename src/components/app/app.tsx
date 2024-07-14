import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useLocation } from 'react-router-dom';

const App = () => {
  const location = useLocation();
  const backgroundLocation = location.state?.background;

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/login' element={<Login />} />
        <Route path='/notfound404' element={<NotFound404 />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/profileorders' element={<ProfileOrders />} />
        <Route path='/register' element={<Register />} />
        <Route path='/resetpassword' element={<ResetPassword />} />
      </Routes>
    </div>
  );
};

export default App;
