import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Portfolio.module.css';
import BuyModal from '../Modal/BuyModal';
import Sidebar from '../components/MobileSideBar';
import BottomTabs from '../components/BottomTabs';
import 'react-activity/dist/library.css'; 
import DesktopSideBar from '../components/DesktopSideBar';
import DesktopHeader from '../components/DashboardHeader'
import SendModal from '../Modal/SendModal';
import LoadingSkeleton from '../components/Loader';
import AuthModal from '../Modal/AuthModal';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchInvestment } from '../store/action/appStorage';
import { FaDollarSign, FaDatabase } from 'react-icons/fa';
import { idbRemove, idbSet, idbGet } from "../store/action/appStorage";
import MultiCoinChart from './Chart';



const Portfolio = () => {
    const [cryptoData, setCryptoData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openBuyModal, setOpenBuyModal] = useState(false);
    const [openSendModal, setOpenSendModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [isAuthError, setIsAuthError] = useState(false);
    const [authInfo, setAuthInfo] = useState("");
    const [count, setCount] = useState(0);
    const [investment, setInvestment] = useState(null);
    const [btcEquivalent, setBtcEquivalent] = useState("0.0000");
    const [btcPrice, setBtcPrice] = useState(null);

    const dispatch = useDispatch();
    const { user, chain, network, address } = useSelector(state => state.userAuth);

    const fetchAllData = async () => {
        try {
            const investRes = await dispatch(fetchInvestment(user._id));
            if (!investRes) {
                setAuthInfo("Failed to fetch investment data.");
                return setIsAuthError(true);
            }
            setInvestment(investRes.message);
        } catch (error) {
            console.error("Error fetching data:", error);
            setAuthInfo("An unexpected error occurred.");
            setIsAuthError(true);
        } finally {
            setLoading(false);
        }
    };

    const fetchCryptoData = async () => {
        try {
            const res = await fetch(
                'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin&order=market_cap_desc&per_page=1&page=1&sparkline=false'
            );
            const data = await res.json();
            setBtcPrice(data[0].current_price);
        } catch (error) {
            console.error('Error fetching BTC price:', error);
        }
    };

    useEffect(() => {
        fetchAllData();
        fetchCryptoData();
    }, []);

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });

        const fetchAllCoins = async () => {
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

        fetchAllCoins();
    }, []);

    useEffect(() => {
        const storedCount = localStorage.getItem('liveTradersCount');
        if (storedCount) {
            setCount(Number(storedCount));
        }

        const increment = 5;
        const interval = setInterval(() => {
            setCount(prev => {
                const next = prev + increment;
                localStorage.setItem('liveTradersCount', next);
                return next;
            });
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (btcPrice && user?.availableBalance) {
            const btcVal = (user.availableBalance / btcPrice).toFixed(6);
            setBtcEquivalent(btcVal);
        }
    }, [btcPrice, user?.availableBalance]);

    const updateAuthError = () => {
        setIsAuthError(false);
        setAuthInfo('');
    };

    const navigateHandler = (url) => navigate(`/${url}`);

    const openBuyModalFun = () => setOpenBuyModal(true);
    const openSendModalFun = () => setOpenSendModal(true);

    const buyFunction = () => setOpenBuyModal(false);
    const sellFunction = () => setOpenBuyModal(false);
    const sendFunction = () => setOpenSendModal(false);
    const receiveFunction = () => setOpenSendModal(false);

    const openMobileMenu = () => setSidebarOpen(prev => !prev);
    const notificationHandler = () => navigate('/notifications');

    const navigateTabHandler = async (url) => {
        try {
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
        } catch (err) {
          console.log(err)
        }
      };

    if (loading) {
        return <LoadingSkeleton />;
    }
    




    return (
        <>
            {isAuthError && <AuthModal modalVisible={isAuthError} updateVisibility={updateAuthError} message={authInfo} />}
            {openBuyModal && <BuyModal buyFun={buyFunction} sellFun={sellFunction} />}
            {openSendModal && <SendModal sendFun={sendFunction} receiveFun={receiveFunction} />}

            <div className={styles.dashboard}>
                <div className={styles.leftSection}>
                    <DesktopSideBar isInvest={true} navigateMobileHandler={navigateTabHandler} />
                </div>

                {sidebarOpen && (
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isInvest={true} navigateMobileHandler={navigateTabHandler} />
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
                    
                        <div className={styles.tickerTape}>
                            <div className={styles.tickerInner}>
                                {cryptoData.map((coin, index) => (
                                    <div key={index} className={styles.tickerItem}>
                                        <img src={coin.image} alt={coin.name} className={styles.coinIcon} />
                                        <span className={styles.coinName}>{coin.symbol.toUpperCase()}</span>
                                        <span className={coin.price_change_percentage_24h >= 0 ? styles.priceUp : styles.priceDown}>
                                            ${coin.current_price.toFixed(2)} ({coin.price_change_percentage_24h.toFixed(2)}%)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.cardContainer}>
                            <div className={styles.cardSection}>
                                <div className={styles.topCard}>
                                    <div className={styles.welcomeContent}>
                                        <div className={styles.leftContent}>
                                            <h3>Welcome Back, {user?.firstName?.slice(0, 5)}!</h3>
                                            <p className={styles.balanceLabel}>Available Balance</p>
                                            <h1 className={styles.balanceAmount}>${user.availableBalance}</h1>
                                            <p className={styles.balanceBTC}>{btcEquivalent} BTC</p>
                                        </div>
                                        <div className={styles.actionButtons}>
                                            <button className={styles.depositBtn} onClick={() => navigateHandler('fund-account')}>Deposit</button>
                                            <button className={styles.withdrawBtn} onClick={() => navigateHandler('withdraw')}>Withdraw</button>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.bottomCards}>
                                    <div className={styles.carditem}>
                                        <div className={styles.cardIcon} style={{ backgroundColor: '#4e54c8' }}>
                                            <FaDollarSign size={20} />
                                        </div>
                                        <p className={styles.cardTitle}>Total Profit</p>
                                        <h2 className={styles.cardAmount}>${investment?.totalProfit}.00</h2>
                                    </div>

                                    <div className={styles.carditem}>
                                        <div className={styles.cardIcon} style={{ backgroundColor: '#1fa2ff' }}>
                                            <FaDatabase size={20} />
                                        </div>
                                        <p className={styles.cardTitle}>Referral Bonus</p>
                                        <h2 className={styles.cardAmount}>${investment?.referralBonus}.00</h2>
                                        <p className={styles.percentageUp}>+7.11%</p>
                                    </div>

                                    <div className={styles.carditem}>
                                        <div className={styles.cardIcon} style={{ backgroundColor: '#f953c6' }}>
                                            <FaDatabase size={20} />
                                        </div>
                                        <p className={styles.cardTitle}>Total Deposit</p>
                                        <h2 className={styles.cardAmount}>${investment?.totalDeposit}.00</h2>
                                        <p className={styles.percentageUp}>+8.34%</p>
                                        <p className={styles.liveTraders}>
                                            Live Traders<br />${count.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                               
                            </div>

                            <div className={styles.cardRightSection}>
                                <div className={styles.rightCard}>
                                    <h3 className={styles.title}>Ongoing Investment</h3>

                                    <div className={styles.section}>
                                        <p className={styles.label}>Investment Plan</p>
                                        <div className={styles.planBox}>
                                            <span className={styles.planName}>{investment?.isActive ? investment?.investmentPlan : '---'}</span>
                                        </div>
                                    </div>

                                    <div className={styles.infoRow}>
                                        <div className={styles.infoBox}>
                                            <p className={styles.label}>Amount</p>
                                            <p className={styles.value}>
                                                {investment?.isActive ? '$' + investment?.amount : '---'}
                                            </p>
                                        </div>
                                        <div className={styles.infoBox}>
                                            <p className={styles.label}>Date</p>
                                            <p className={styles.value}>
                                                {investment?.isActive && investment?.date
                                                    ? new Date(investment.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })
                                                    : '---'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className={styles.section}>
                                        <p className={styles.label}>Profit</p>
                                        <p className={styles.value}>
                                            {investment?.isActive ? '$' + investment?.profit : '---'}
                                        </p>
                                    </div>

                                    <button className={styles.button} onClick={() => navigateHandler('fund-account')}>Transact...</button>
                                </div>

                            </div>

                           
                        </div>

                    
                     
                        

                       
                        <div className={styles.cardContainer}>
                        <MultiCoinChart />
                        </div>
                        
                           


                    </div>
                </div>
            </div>

            <BottomTabs navigateTabHandler={navigateTabHandler} />
        </>
    );
};

export default Portfolio;

