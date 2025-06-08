import React, { Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import FallBackComponent from './components/Fallback';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import InstallBanner from './components/PWA';

import Splash from './screens/Splash';
import Splash2 from './screens/Splash2';
import Login from './screens/Login';
import Verification from './screens/Verification';
import Passcode from './screens/Passcode';
import ConfirmPasscode from './screens/ConfirmPasscode';
import Notification from './screens/Notification';
import Password from './screens/Password';
import Wallet from './screens/Wallet';
import CreateWallet from './screens/CreateWallet';
import ImportWallet from './screens/ImportWallet';

import Dashboard from './screens/Dashboard';
import SendAsset from './screens/SendAsset';
import BuyAsset from './screens/BuyAsset';
import SellAsset from './screens/SellAsset';
import ReceiveAsset from './screens/Receive';
import Settings from './screens/Settings';
import Send from './screens/Send';
import Profile from './screens/Profile';
import NotificationPage from './screens/NotificationPage';
import Transactions from './screens/Transaction';

import Assets from './screens/Assets';
import Portfolio from './screens/Portfolio';
import { checkIfIsLoggedIn, logout } from "./store/action/appStorage";
import TradeCenter from "./screens/Trade-center";
import Upgrade from "./screens/Upgrade";
import FundAccount from "./screens/FundAccount";
import Withdraw from "./screens/Withdraw";

import { generateToken, messaging } from './notifications/firebase';
import { onMessage } from "firebase/messaging";
import { NotificationToast } from "./component/general/Notification";

import { toast, Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Registeration from './screens/Registeration';
import ProfilePhoto from './screens/ProfilePhoto';


import ImgUrl from './assets/192.png';

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isPwa,setIsPWA] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();



  useEffect(() => {
    const apiCall = async () => {
      const res = await dispatch(checkIfIsLoggedIn());
      if (res.bool) {
        navigate('/portfolio');
        generateToken(res.message.user);
        onMessage(messaging, (payload) => {
          toast(<NotificationToast
            title={payload.notification.title}
            message={payload.notification.body}
            image={ImgUrl}
          />, {
            position: "top-right",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            transition: Slide,
          });
        });
      }
      setIsLoading(false);
    };
    apiCall();

    const isInStandaloneMode = () =>
      window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    setIsPWA(isInStandaloneMode());
  }, []);

  useEffect(() => {
    if (location.pathname === '/logout') {
      dispatch(logout());
      navigate('/login');
    }
  }, [location]);

  // ✅ Test toast on load


  if (isLoading) {
    return <FallBackComponent />;
  }

  return (
    <div className="App">
      <Suspense fallback={<FallBackComponent />}>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Splash />} />
          <Route path='/onboarding' element={<Splash2 />} />
          <Route path='/login' element={<Login />} />
          <Route path='/verification' element={<Verification />} />
          <Route path='/passcode' element={<Passcode />} />
          <Route path='/confirm-passcode' element={<ConfirmPasscode />} />
          <Route path='/notification' element={<Notification />} />
          <Route path='/password' element={<Password />} />
          <Route path='/wallet' element={<Wallet />} />
          <Route path='/create-wallet' element={<CreateWallet />} />
          <Route path='/import-wallet' element={<ImportWallet />} />

          {/* Protected Routes */}
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path='/send-assets' element={<ProtectedRoute><SendAsset /></ProtectedRoute>} />
          <Route path='/buy-assets' element={<ProtectedRoute><BuyAsset /></ProtectedRoute>} />
          <Route path='/sell-assets' element={<ProtectedRoute><SellAsset /></ProtectedRoute>} />
          <Route path='/receive' element={<ProtectedRoute><ReceiveAsset /></ProtectedRoute>} />
          <Route path='/settings' element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path='/send' element={<ProtectedRoute><Send /></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path='/notifications' element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />
          <Route path='/transactions' element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path='/assets' element={<ProtectedRoute><Assets /></ProtectedRoute>} />
          <Route path='/portfolio' element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
          <Route path='/portfolio' element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
          <Route path='/trade-center' element={<ProtectedRoute><TradeCenter /></ProtectedRoute>} />
          <Route path='/upgrade' element={<ProtectedRoute><Upgrade /></ProtectedRoute>} />
          <Route path='/fund-account' element={<ProtectedRoute><FundAccount /></ProtectedRoute>} />
          <Route path='/withdraw' element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />


          <Route path='/registeration' element={<ProtectedRoute><Registeration /></ProtectedRoute>} />
          <Route path='/profilephoto' element={<ProtectedRoute><ProfilePhoto /></ProtectedRoute>} />
  

        </Routes>
      </Suspense>

      <InstallBanner />

      {/* ✅ Toast container must be present for toasts to show */}
      <ToastContainer />
    </div>
  );
}

export default App;


