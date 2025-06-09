import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotificationPage.module.css';
import axios from 'axios';
import BuyModal from '../Modal/BuyModal';
import SendModal from '../Modal/SendModal';
import 'react-activity/dist/library.css';
import DesktopSideBar from '../components/DesktopSideBar';
import BackHeader from '../components/BackHeader'
import AuthModal from '../Modal/AuthModal';
import { useSelector } from 'react-redux';
import { idbRemove,idbSet,idbGet } from "../store/action/appStorage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBellSlash } from '@fortawesome/free-solid-svg-icons'; // Add this import at the top



const Notification = () => {
    const [cryptoData, setCryptoData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openBuyModal, setOpenBuyModal] = useState(false);
    const [openSendModal, setOpenSendModal] = useState(false);

    const navigate = useNavigate();

    const [isAuthError, setIsAuthError] = useState(false);
    const [authInfo, setAuthInfo] = useState("");
    let { user, seedphrase, chain, network, address } = useSelector(state => state.userAuth)


    const updateAuthError = () => {
        setIsAuthError(prev => !prev);
        setAuthInfo('')
    }





    useEffect(() => {
        const fetchCryptoData = async () => {
            if (loading) return;
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
                    params: {
                        vs_currency: 'usd',
                        order: 'market_cap_desc',
                        per_page: 20,
                        page: 1
                    }
                });
                setCryptoData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching crypto data:', error);
                setLoading(false);
            }
        };
        fetchCryptoData();
    }, []);

    const openBuyModalFun = () => setOpenBuyModal(true);
    const openSendModalFun = () => setOpenSendModal(true);
    const buyFunction = () => setOpenBuyModal(false);
    const sellFunction = () => setOpenBuyModal(false);
    const sendFunction = () => setOpenSendModal(false);
    const receiveFunction = () => setOpenSendModal(false);
    const navigateHandler = () => navigate(-1);





  



   


    const navigateMobileHandler = async(url) => {
      
        
        if (url === 'dashboard') {
            if (!user.walletFeauture) {
                setIsAuthError(true)
                setAuthInfo('Wallet feature is not enabled yet on this account')
                return
            }
            //logic to check if wallet properties are saved to async storage
            let seedphrase = await idbGet('seedphrase');
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
            let seedphrase = await idbGet('seedphrase');
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
            {isAuthError && <AuthModal modalVisible={isAuthError} updateVisibility={updateAuthError} message={authInfo} />}

            <div className={styles.dashboard}>
                <div className={styles.leftSection}>
                    <DesktopSideBar navigateMobileHandler={navigateMobileHandler} />
                </div>

                <div className={styles.mainSection}>
                    <BackHeader
                        navigateHandler={navigateHandler}
                        openBuyModalFun={openBuyModalFun}
                        openSendModalFun={openSendModalFun}
                        title='Notification'
                    />


                    <div className={styles.dashboardContent}>
                        <div className={styles.dashboardContentleft}>

                            <div className={styles.notificationContainer}>

                            <div className={styles.notificationContainer}>
  <div className={styles.noNotificationBox}>
    <FontAwesomeIcon icon={faBellSlash} size="3x" className={styles.noNotifIcon} />
    <p className={styles.noNotifText}>No notifications yet</p>
    <p className={styles.noNotifSubtext}>You’ll see new alerts and updates here as they arrive.</p>
  </div>
</div>

                               
                            
                            </div>

                        </div>
                        <div className={styles.dashboardContentright}>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Notification;
