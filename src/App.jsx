import React, { Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import FallBackComponent from './components/Fallback';
import { useDispatch } from 'react-redux';
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
import Registeration from './screens/Registeration';
import ProfilePhoto from './screens/ProfilePhoto';
import Portfolio from './screens/Portfolio';
import { checkIfIsLoggedIn, logout } from "./store/action/appStorage";
import TradeCenter from "./screens/Trade-center";
import Upgrade from "./screens/Upgrade";
import FundAccount from "./screens/FundAccount";
import Withdraw from "./screens/Withdraw";



function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isPWA, setIsPWA] = useState(false);
  const navigate = useNavigate()

  const location = useLocation()

  useEffect(() => {
    let apiCall = async () => {
      let res = await dispatch(checkIfIsLoggedIn());
      setIsLoading(false);
    }
    apiCall();

    // Detect if the app is running as a PWA
    const isInStandaloneMode = () =>
      window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

    setIsPWA(isInStandaloneMode());
  }, [dispatch]);



  useEffect(() => {
    if (location.pathname === '/logout') {
      // dispatch logout functions
      dispatch(logout())
      navigate('/login')
    }
  }, [location]);


  if (isLoading) {
    return <FallBackComponent />;
  }

  return (
    <div className="App">
      <Suspense fallback={<FallBackComponent />}>
        <Routes>
          {/* Public Routes */}
         
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
          <Route path='/invest' element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
          <Route path='/registeration' element={<ProtectedRoute><Registeration /></ProtectedRoute>} />
          <Route path='/profilephoto'  element={<ProtectedRoute><ProfilePhoto /></ProtectedRoute>} />

          <Route path='/portfolio'  element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />

          <Route path='/trade-center'  element={<ProtectedRoute><TradeCenter /></ProtectedRoute>} />

          <Route path='/upgrade'  element={<ProtectedRoute><Upgrade /></ProtectedRoute>} />
          <Route path='/fund-account'  element={<ProtectedRoute><FundAccount /></ProtectedRoute>} />

          <Route path='/withdraw'  element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />

          {/* Conditional Root Route */}
          <Route path='/' element={<Splash/>} />
        </Routes>
      </Suspense>
      <InstallBanner />
    </div>
  );
}

export default App;


