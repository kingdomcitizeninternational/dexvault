import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Portfolio.module.css';
import BuyModal from '../Modal/BuyModal';
import Sidebar from '../components/MobileSideBar';
import BottomTabs from '../components/BottomTabs';
import 'react-activity/dist/library.css'; // 
import DesktopSideBar from '../components/DesktopSideBar';
import DesktopHeader from '../components/DashboardHeader'
import SendModal from '../Modal/SendModal';
import LoadingSkeleton from '../components/Loader';
import AuthModal from '../Modal/AuthModal';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useSelector } from 'react-redux';



const Portfolio = () => {
    const [cryptoData, setCryptoData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openBuyModal, setOpenBuyModal] = useState(false);
    const [openSendModal, setOpenSendModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate()
    const [isAuthError, setIsAuthError] = useState(false);
    const [authInfo, setAuthInfo] = useState("");
    let { user, seedphrase, chain, network, address } = useSelector(state => state.userAuth)
    const targetValue = 18500;
    const [count, setCount] = useState(0);




    useEffect(() => {
        AOS.init({ duration: 1000, once: true });

        const fetchCryptoData = async () => {
            try {
                const res = await fetch(
                    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false'
                );
                const data = await res.json();
                setCryptoData(data);
            } catch (error) {
                console.error('Error fetching crypto data:', error);
            }
        };

        fetchCryptoData();
    }, []);



    useEffect(() => {
        // Check if there's a stored value
        const storedCount = localStorage.getItem('liveTradersCount');
        if (storedCount) {
            setCount(Number(storedCount));
        }

        const increment = 5; // Control speed here
        const interval = setInterval(() => {
            setCount(prev => {
                const next = prev + increment;

                localStorage.setItem('liveTradersCount', next);
                return next;
            });
        }, 1500); // Control animation smoothness here

        return () => clearInterval(interval);
    }, []);





    const updateAuthError = () => {
        setIsAuthError(prev => !prev);
        setAuthInfo('')
    }


    const openBuyModalFun = () => {
        setOpenBuyModal(true)
    }

    const openSendModalFun = () => {
        setOpenSendModal(true)
    }

    const buyFunction = () => {
        setOpenBuyModal(false)


    }
    const sellFunction = () => {
        setOpenBuyModal(false)


    }


    const sendFunction = () => {
        setOpenSendModal(false)
    }

    const receiveFunction = () => {
        setOpenSendModal(false)
    }


    const openMobileMenu = () => {
        setSidebarOpen(prev => !prev)
    }





    const notificationHandler = () => {
        navigate('/notifications')
    }

    if (loading) {
        return <LoadingSkeleton />
    }




    const navigateTabHandler = (url) => {
        if (user.walletFeauture) {
            setIsAuthError(true)
            setAuthInfo('Wallet feature is not enabled yet on this account')
            return
        }
        if (url === 'dashboard') {
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

    }






    const navigateMobileHandler = (url) => {
        if (user.walletFeauture) {
            setIsAuthError(true)
            setAuthInfo('Wallet feature is not enabled yet on this account')
            return
        }
        if (url === 'dashboard') {
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
            {isAuthError && <AuthModal modalVisible={isAuthError} updateVisibility={updateAuthError} message={authInfo} />}
            {openBuyModal && <BuyModal buyFun={buyFunction} sellFun={sellFunction} />}
            {openSendModal && <SendModal sendFun={sendFunction} receiveFun={receiveFunction} />}

            <div className={styles.dashboard}>
                <div className={styles.leftSection}>
                    <DesktopSideBar isInvest={true} navigateMobileHandler={navigateMobileHandler} />
                </div>

                {/*  sidebar content */}
                {sidebarOpen && (
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isInvest={true} navigateMobileHandler={navigateMobileHandler} />
                )}

                <div className={styles.mainSection}>
                    <DesktopHeader
                        openMobileMenu={openMobileMenu}
                        notificationHandler={notificationHandler}
                        openBuyModalFun={openBuyModalFun}
                        openSendModalFun={openSendModalFun}
                        sidebarOpen={sidebarOpen}
                    />


                    <div className={styles.dashboardContent}>
                        <div className={styles.tickerTape} style={{ marginRight: '10px', marginLeft: '10px', marginBottom: "0px" }}>
                            <div className={styles.tickerInner}>
                                {cryptoData.map((coin, index) => (
                                    <div key={index} className={styles.tickerItem}>
                                        <img src={coin.image} alt={coin.name} className={styles.coinIcon} />
                                        <span className={styles.coinName}>{coin.symbol.toUpperCase()}</span>
                                        <span
                                            className={
                                                coin.price_change_percentage_24h >= 0
                                                    ? styles.priceUp
                                                    : styles.priceDown
                                            }
                                        >
                                            ${coin.current_price.toFixed(2)}
                                            ({coin.price_change_percentage_24h.toFixed(2)}%)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>


                        <div className={styles.dashboardGrid}>
                            <div className={`${styles.card} ${styles.balance}`} data-aos="fade-up">
                                <div className={styles.cardContent}>
                                    <h2>{user.currency ? user.currency : '$'}{user.availableBalance}</h2>
                                </div>
                                <p>Balance</p>
                            </div>

                            <div className={`${styles.card} ${styles.trendsCard}`} data-aos="fade-up" data-aos-delay="300">
                                <div className={styles.cardContent}>
                                    <h2>{count.toLocaleString()}</h2>
                                </div>
                                <p>Total Live Traders</p>
                            </div>

                            <div className={`${styles.card} ${styles.referralCard}`} data-aos="fade-up" data-aos-delay="600">
                                <div className={styles.cardContent}>
                                    <h3>Refer Friends. Get Rewarded</h3>
                                </div>
                                <p>You can earn $40.00 referral reward for each new DExvault user!</p>
                                <a href="#">Learn more</a>
                            </div>
                        </div>





                        <div className={styles.chartContainer}>
                            <iframe
                                src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_b64f2&symbol=BITSTAMP%3ABTCUSD&interval=D&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=Light&style=1&timezone=Etc%2FUTC&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=en&utm_source=localhost"
                                width="100%"
                                height="500"
                                allowtransparency="true"
                                frameBorder="0"

                            ></iframe>
                        </div>
                    </div>




                </div>
            </div>

            <BottomTabs navigateTabHandler={navigateTabHandler} />
        </>

    );
};

export default Portfolio;
