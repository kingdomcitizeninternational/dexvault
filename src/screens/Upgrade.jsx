import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Upgrade.module.css';
import Sidebar from '../components/MobileSideBar';
import 'react-activity/dist/library.css';
import DesktopSideBar from '../components/DesktopSideBar';
import LoadingSkeleton from '../components/Loader';
import AuthModal from '../Modal/AuthModal';
import AOS from 'aos';
import 'aos/dist/aos.css';
import BackHeader from '../components/DashboardHeader';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackages } from '../store/action/appStorage';
import { fetchInvestment } from '../store/action/appStorage';





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
    const [plans, setPlans] = useState([]);
    const [investment, setInvestment] = useState(null);
    const dispatch = useDispatch()

// Fetch user investment
    const fetchInvest = async () => {
        const res = await dispatch(fetchInvestment(user._id));
        if (!res) {
            setAuthInfo(res.message);
            return setIsAuthError(true);
        }
        if(!res.message.investmentPlan){
            setAuthInfo(`you have no current plan. Contact administrator  to buy an investment investment plan`,);
            return setIsAuthError(true);

        }

        setInvestment(res.message);
        setAuthInfo(`your current plan is ${res.message.investmentPlan}. Contact administrator if you intend to change your investment plan`,);
        return setIsAuthError(true);

    };

    // Fetch all plans
    const fetchAllPlans = async () => {
        const res = await dispatch(fetchPackages());
        if (!res) {
            setIsAuthError(true);
            setAuthInfo(res.message);
            return;
        }
        setPlans(res.message);
    };

    useEffect(() => {
        fetchInvest();
        fetchAllPlans();
    }, []);

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


    const navigatePlanHandler = ()=>{
        return
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