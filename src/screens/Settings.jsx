import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Settings.module.css';
import {
  FaLock, FaFingerprint, FaShieldAlt, FaClock,
  FaNetworkWired, FaCoins, FaGasPump, FaSearchLocation,
  FaSun, FaLanguage, FaDollarSign, FaBell,
} from 'react-icons/fa';
import BuyModal from '../Modal/BuyModal';
import SendModal from '../Modal/SendModal';
import DesktopSideBar from '../components/DesktopSideBar';
import BackHeader from '../components/BackHeader';
import NetworkModal from '../Modal/NetworkModal';
import CurrencyModal from '../Modal/CurrencyModal';
import { useSelector } from 'react-redux';
import AuthModal from '../Modal/AuthModal';

const Settings = () => {
  const [openBuyModal, setOpenBuyModal] = useState(false);
  const [openSendModal, setOpenSendModal] = useState(false);
  const [openNetworkModal, setOpenNetworkModal] = useState(false);
  const [openCurrencyModal, setOpenCurrencyModal] = useState(false);
  const [isAuthError, setIsAuthError] = useState(false);
  const [authInfo, setAuthInfo] = useState("");


  const updateAuthError = () => {
    setIsAuthError(prev => !prev);
    setAuthInfo('')
  }


  const navigate = useNavigate();
  const openBuyModalFun = () => setOpenBuyModal(true);
  const openSendModalFun = () => setOpenSendModal(true);
  const buyFunction = () => setOpenBuyModal(false);
  const sellFunction = () => setOpenBuyModal(false);
  const sendFunction = () => setOpenSendModal(false);
  const receiveFunction = () => setOpenSendModal(false);
  const navigateHandler = () => navigate(-1);
  const openNetworkModalHandler = () => setOpenNetworkModal(true)
  const openCurrencyModalHandler = () => setOpenCurrencyModal(true)
  let { user, seedphrase, chain, network, address } = useSelector(state => state.userAuth)


  const hideModal = () => {
    setOpenNetworkModal(false)
  }

  const hideCurrencyModal = () => {
    setOpenCurrencyModal(false)
  }



   const navigateMobileHandler = (url) => {
       
        if (url === 'dashboard') {
          if (!user.walletFeauture) {
            setIsAuthError(true)
            setAuthInfo('Wallet feature is not enabled yet on this account')
            return
          }
            //logic to check if wallet properties are saved to async storage
            let seedphrase = localStorage.getItem('seedphrase');
            if (!seedphrase) {
                return navigate('/create-wallet', { state: { email: user.email } })
            } else {
                if (seedphrase && chain && network && address) {
                    return navigate('/dashboard')
                } else {
                    return navigate('/import-wallet', { state: { email: user.email, seedphrase: seedphrase } })
                }
            }


        } else if (url === 'transactions') {
          if (!user.walletFeauture) {
            setIsAuthError(true)
            setAuthInfo('Wallet feature is not enabled yet on this account')
            return
          }
            //logic to check if wallet properties are saved to async storage
            let seedphrase = localStorage.getItem('seedphrase');
            if (!seedphrase) {
                return navigate('/create-wallet', { state: { email: user.email } })
            } else {

                if (seedphrase && chain && network && address) {
                    return navigate('/transactions')

                } else {

                    return navigate('/import-wallet', { state: { email: user.email, seedphrase: seedphrase } })
                }
            }


        } else {
            return navigate(`/${url}`)
        }

    };


  return (
    <>
      {openBuyModal && <BuyModal buyFun={buyFunction} sellFun={sellFunction} />}
      {openSendModal && <SendModal sendFun={sendFunction} receiveFun={receiveFunction} />}
      {openNetworkModal && < NetworkModal hideModal={hideModal} />}
      {openCurrencyModal && <CurrencyModal hideModal={hideCurrencyModal} />}
      {isAuthError && <AuthModal modalVisible={isAuthError} updateVisibility={updateAuthError} message={authInfo} />}

      <div className={styles.dashboard}>
        <div className={styles.leftSection}>
          <DesktopSideBar navigateMobileHandler={navigateMobileHandler} />
        </div>

        <div className={styles.mainSection}>
          {/* ✅ Use BackHeader here */}
          <BackHeader
            navigateHandler={navigateHandler}
            openBuyModalFun={openBuyModalFun}
            openSendModalFun={openSendModalFun}
            title='Settings'
          />

          <div className={styles.dashboardContent}>
            <div className={styles.dashboardContentleft}>

              {/* SECURITY */}
              <div className={styles.settingsSection}>
                <h3 className={styles.settingsTitle}>Security</h3>
                <div className={styles.settingsItem}><FaLock className={styles.icon} /> Change PIN</div>
                <div className={styles.settingsItem}><FaFingerprint className={styles.icon} /> Biometric Authentication</div>
                <div className={styles.settingsItem}><FaShieldAlt className={styles.icon} /> Two-Factor Authentication</div>
                <div className={styles.settingsItem}>
                  <FaClock className={styles.icon} /> Auto-Lock
                  <span className={styles.settingRight}>1 minute</span>
                </div>
              </div>

              {/* NETWORK */}
              <div className={styles.settingsSection}>
                <h3 className={styles.settingsTitle}>Network</h3>

                {seedphrase && chain && network && address && <div className={styles.settingsItem} onClick={openNetworkModalHandler}><FaNetworkWired className={styles.icon} /> Select Network</div>}

              
                {seedphrase && chain && network && address &&<div className={styles.settingsItem}><FaGasPump className={styles.icon} /> Gas Fee Settings</div>}

                <div className={styles.settingsItem}><FaSearchLocation className={styles.icon} /> Explorer Preference</div>
              </div>

              {/* NOTIFICATIONS */}
              <div className={styles.settingsSection}>
                <h3 className={styles.settingsTitle}>Notifications</h3>
                <div className={styles.settingsItem}>
                  <FaSun className={styles.icon} /> Theme
                  <span className={styles.settingRight}>Light</span>
                </div>
                <div className={styles.settingsItem}>
                  <FaLanguage className={styles.icon} /> Language
                  <span className={styles.settingRight}>English</span>
                </div>
                <div className={styles.settingsItem} onClick={openCurrencyModalHandler}>
                  <FaDollarSign className={styles.icon} /> Currency
                  <span className={styles.settingRight}>{user.currency ? user.currency : 'USD'}</span>
                </div>
               

              </div>

            </div>
            <div className={styles.dashboardContentright}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
