import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Withdraw.module.css';
import BuyModal from '../Modal/BuyModal';
import Sidebar from '../components/MobileSideBar';
import 'react-activity/dist/library.css'; // 
import DesktopSideBar from '../components/DesktopSideBar';
import SendModal from '../Modal/SendModal';
import { BitcoinPaymentModal } from '../Modal/PaymentModal'
import AuthModal from '../Modal/AuthModal';
import BackHeader from '../components/BackHeader';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-activity/dist/Spinner';
import { createDeposit, fetchDeposit } from '../store/action/appStorage';



const FundAccount = () => {
    const [loading, setLoading] = useState(false);
    const [openBuyModal, setOpenBuyModal] = useState(false);
    const [openSendModal, setOpenSendModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openPaymentModal, setOpenPaymentModal] = useState(false)
    const navigate = useNavigate()
    const [isAuthError, setIsAuthError] = useState(false);
    const [authInfo, setAuthInfo] = useState("");
    const [cryptoData, setCryptoData] = useState([]);
    const [isDeposits, setIsDeposits] = useState([]);
    const [adminPaymentAddr, setAdminPaymentAddr] = useState({
        name: '',
        address: ''
    })
    const [paymentAmount, setPaymentAmount] = useState()
    const [isPaymentMode, setIsPaymentMode] = useState('Bitcoin')
    let { user, chain, network, address, admin } = useSelector(state => state.userAuth)
    const dispatch = useDispatch()

    const [fund, setFund] = useState({
        plan: 'Starter',
        amount: '2000'
    })



    // retrieve crypto data
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


    // retrieve deposit data

    const fetchDepositHandler = async () => {
        if (loading) return;
        try {
            setLoading(true);
            const res = await dispatch(fetchDeposit({ user }));
            if (!res.bool) {
                setAuthInfo(res.message);
                setIsAuthError(true);
                setLoading(false);
                return;
            }
            setIsDeposits(res.message);
            setLoading(false);
        } catch (err) {
            setAuthInfo(err.message);
            setIsAuthError(true);
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchDepositHandler();
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



    const navigateHandler = () => {
        navigate(-1)
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
    }

    const changeHandler = (data) => {
        if (data === 'Starter') {
            setFund({
                plan: 'Starter',
                amount: '2000'
            })

        } else if (data === 'Bronze') {
            setFund({
                plan: 'Bronze',
                amount: '3000'
            })


        } else if (data === 'Silver') {
            setFund({
                plan: 'Silver',
                amount: '4000'
            })


        }
    }

    const changeModeHandler = (data) => {
        setIsPaymentMode(data)
    }

    const createDepositHandler = async () => {
        if (loading) return;

        if (!user?.accountStatus) {
            setAuthInfo('Account not yet verified');
            setIsAuthError(true);
            return;
        }

        if (isPaymentMode === 'isPaymentMode' || isPaymentMode === '') {
            setAuthInfo('Please select the mode of deposit');
            setIsAuthError(true);
            return;
        }

        const { amount, plan } = fund;
        const mode = isPaymentMode;

        if (!amount || !plan || !mode) {
            setAuthInfo('Please fill all required fields correctly');
            setIsAuthError(true);
            return;
        }

        if (!user?.email) {
            setAuthInfo('User information is missing');
            setIsAuthError(true);
            return;
        }

        const data = {
            amount,
            plan,
            mode,
            user
        };

        try {
            setLoading(true);
            const res = await dispatch(createDeposit(data));

            if (!res.bool) {
                setIsAuthError(true);
                setAuthInfo(res.message);
                setLoading(false);
                return;
            }

            setLoading(false);
            setIsDeposits(res.message);
            setAuthInfo('Deposit initiated. Scroll down the history table, click the pay now, and follow the instruction to complete payment');
            setIsAuthError(true);

            // ✅ Clear input fields after successful submission
            setFund({
                plan: '',
                amount: ''
            });
            setIsPaymentMode('');

            return;

        } catch (error) {
            setLoading(false);
            setIsAuthError(true);
            setAuthInfo(error.message || 'Something went wrong');
        }
    };





    const togglePaymentModalHandler = () => {
        setOpenPaymentModal(prev => !prev)
    }


    const openPaymentModalHandler = (amount, type) => {
        if (type === 'Bitcoin') {
            setAdminPaymentAddr({
                name: 'Bitcoin',
                address: admin.bitcoinwalletaddress,
            })
        } else if (type === 'Etheruem') {
            setAdminPaymentAddr({
                name: 'Etheruem',
                address: admin.etheriumwalletaddress,
            })
        }
        setPaymentAmount(amount)
        setOpenPaymentModal(true)
    }


    return (
        <>
            {openPaymentModal && <BitcoinPaymentModal btcAddress={adminPaymentAddr} modalVisible={true} updateVisibility={togglePaymentModalHandler} amount={paymentAmount} />}
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
                        title='Deposit Fund'
                    />

                    <div className={styles.tickerTape} style={{ margin: '0 10px' }}>
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
                                        ${coin.current_price.toFixed(2)} ({coin.price_change_percentage_24h.toFixed(2)}%)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {!loading ? <div className={styles.container}>

                        <div className={styles.card}>
                            <div className={styles.formGroup}>
                                <select
                                    className={styles.select}
                                    style={{
                                        width: '100%',
                                        padding: '12px 15px',
                                        fontSize: '16px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        backgroundColor: '#fff',
                                        outline: 'none',
                                        transition: 'border 0.3s ease',
                                    }}
                                    onChange={(e) => changeModeHandler(e.target.value)}
                                >
                                    <option value="">Method of Payment</option>
                                    <option value="">Bitcoin</option>
                                    <option value="">Etheruem</option>
                                    <option value="">Gcash</option>


                                </select>

                            </div>

                            <div className={styles.formGroup}>
                                <select
                                    className={styles.select}
                                    value={isPaymentMode}
                                    onChange={(e) => changeModeHandler(e.target.value)}
                                >
                                    <option value="">Method of Payment</option>
                                    <option value="Bitcoin">Bitcoin</option>
                                    <option value="Etheruem">Etheruem</option>
                                    <option value="Gcash">Gcash</option>
                                </select>

                            </div>

                            <div className={styles.formGroup}>
                                <input
                                    type="number"
                                    placeholder="Enter amount in dollars"
                                    className={styles.input}
                                    value={fund.amount}
                                    onChange={(e) => setFund(prev => ({ ...prev, amount: e.target.value }))}
                                />

                            </div>


                            <button className={styles.button} onClick={createDepositHandler}>Create Deposit </button>
                        </div>

                        {isDeposits.length === 0 && <div className={styles.historyCard}>
                            <h3 className={styles.sectionTitle}>History</h3>
                            {/* You can map deposit history items here */}
                            <p className={styles.emptyText}>No withdrawal found.</p>
                        </div>}


                        {isDeposits && isDeposits.length > 0 && (
                            <div className={styles.tableWrapper}>
                                <table className={styles.tradeTable}>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Date</th>
                                            <th>AMOUNT</th>
                                            <th>TRANSACTION TYPE</th>
                                            <th>STATUS</th>
                                            {isDeposits.some(deposit => deposit.status === 'pending') && <th>ACTION</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isDeposits.map((deposit, index) => (
                                            <tr key={deposit._id || index}>
                                                <td>#{deposit.depositId?.slice(0, 8) || 'N/A'}</td>
                                                <td>{new Date(deposit.date).toLocaleDateString()}</td>
                                                <td>{deposit.amount}</td>
                                                <td style={{ color: '#10B981', fontWeight: 'bold' }}>{deposit.type}</td>
                                                <td
                                                    style={{
                                                        color: deposit.status === 'pending' ? '#EF4444' : '#10B981',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {deposit.status}
                                                </td>
                                                {deposit.status === 'pending' && (
                                                    <td>
                                                        <button onClick={() => openPaymentModalHandler(deposit.amount, deposit.type)} className={styles.payNowBtn}>Pay Now</button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}


                    </div> : <div style={{
                        width: '100%',
                        height: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingBottom: '20px'
                    }}>
                        <Spinner size={24} color="#4F46E5" speed={0.5} animating={true} />
                    </div>}

                </div>
            </div>
        </>
    );
};

export default FundAccount;