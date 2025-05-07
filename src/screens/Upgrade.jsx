import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Upgrade.module.css';
import BuyModal from '../Modal/BuyModal';
import Sidebar from '../components/MobileSideBar';
//import styles from '../../components/Sidebar.module.css';
import 'react-activity/dist/library.css'; // 
import DesktopSideBar from '../components/DesktopSideBar';
import SendModal from '../Modal/SendModal';
import LoadingSkeleton from '../components/Loader';
import AuthModal from '../Modal/AuthModal';
import AOS from 'aos';
import 'aos/dist/aos.css';
import BackHeader from '../components/BackHeader';
import { useSelector } from 'react-redux';





const Upgrade = () => {
    const [cryptoData, setCryptoData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openBuyModal, setOpenBuyModal] = useState(false);
    const [openSendModal, setOpenSendModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate()
    const [isAuthError, setIsAuthError] = useState(false);
    const [authInfo, setAuthInfo] = useState("");
    let { user, seedphrase, chain, network, address } = useSelector(state => state.userAuth)



    useEffect(() => {
        AOS.init({
            duration: 800, // animation duration
            once: true     // only animate once
        });
    }, []);

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
    const navigateHandler = () => {
        navigate(-1)
    }

    if (loading) {
        return <LoadingSkeleton />
    }
    const plans = [
        {
            name: 'Starter',
            price: `${user.currency ? user.currency : '$'}2,000.00`,
            features: [
                '24x7 Support',
                'Professional Charts',
                'Trading Alerts',
                'Trading Central Starter',
                '6,500 USD Bonus',
            ],
        },
        {
            name: 'Bronze',
            price: `${user.currency ? user.currency : '$'}3,000.00`,
            features: [
                '24x7 Support',
                'Professional Charts',
                'Trading Alerts',
                'Trading Central Bronze',
                '8,500 USD Bonus',
            ],
        },
        {
            name: 'Silver',
            price: `${user.currency ? user.currency : '$'}4,000.00`,
            features: [
                '24x7 Support',
                'Professional Charts',
                'Trading Alerts',
                'Trading Central Silver',
                'Live Trading With Experts',
                'SMS & Email Alerts',
                '12,600 USD Bonus',
            ],
        },
    ];

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


    const navigatePlanHandler = ()=>{
        navigate('/fund-account')

    }




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
                    <BackHeader
                        navigateHandler={navigateHandler}
                        openBuyModalFun={openBuyModalFun}
                        openSendModalFun={openSendModalFun}
                        title='Our Plans'
                    />



                    <section className={styles.pricingSection}>

                        <div className={styles.cardWrapper}>
                            {plans.map((plan, index) => (
                                <div
                                    className={styles.card}
                                    key={index}
                                    data-aos="zoom-in"
                                    data-aos-delay={index * 150}
                                >
                                    <h2 className={styles.planName}>{plan.name}</h2>
                                    <p className={styles.planPrice}>{plan.price}</p>
                                    <ul className={styles.featureList}>
                                        {plan.features.map((feature, i) => (
                                            <li key={i}>{feature}</li>
                                        ))}
                                    </ul>
                                    <button className={styles.upgradeBtn} onClick={navigatePlanHandler}>Select Plan</button>
                                </div>
                            ))}
                        </div>
                    </section>


                </div>
            </div>
        </>
    );
};

export default Upgrade;