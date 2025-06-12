import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { createPay, idbGet } from "../store/action/appStorage";

const DepositDetail = () => {
    const [loading, setLoading] = useState(false);
    const [openBuyModal, setOpenBuyModal] = useState(false);
    const [openSendModal, setOpenSendModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openPaymentModal, setOpenPaymentModal] = useState(false);
    const [isAuthError, setIsAuthError] = useState(false);
    const [authInfo, setAuthInfo] = useState("");
    const [cryptoData, setCryptoData] = useState([]);
    const [paymentAmount, setPaymentAmount] = useState();
    const [isData, setIsData] = useState(null);
    const navigate = useNavigate();
    const { user, chain, network, address, admin } = useSelector(state => state.userAuth);
    const dispatch = useDispatch();
    const location = useLocation();

    const [fund, setFund] = useState({
        plan: 'Starter',
        amount: ''
    });

    const {
        status,
        depositId,
        amount,
        type,
        paid,
    } = location.state;

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
        const fetchCryptoData = async () => {
            try {
                const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false');
                const data = await res.json();
                setCryptoData(data);
            } catch (error) {
                console.error('Error fetching crypto data:', error);
            }
        };
        fetchCryptoData();
    }, []);

    useEffect(() => {
        setIsData({ status, depositId, amount, type, paid });
    }, []);

    const updateAuthError = () => {
        setIsAuthError(prev => !prev);
        setAuthInfo('');
    };

    const openBuyModalFun = () => setOpenBuyModal(true);
    const openSendModalFun = () => setOpenSendModal(true);
    const buyFunction = () => setOpenBuyModal(false);
    const sellFunction = () => setOpenBuyModal(false);
    const sendFunction = () => setOpenSendModal(false);
    const receiveFunction = () => setOpenSendModal(false);

    const navigateHandler = () => navigate(-1);

    const navigateMobileHandler = async (url) => {
        if (!user.walletFeauture) {
            setIsAuthError(true);
            setAuthInfo('Wallet feature is not enabled yet on this account');
            return;
        }

        const seedphrase = await idbGet('seedphrase');

        if (!seedphrase) {
            return navigate('/create-wallet', { state: { email: user.email } });
        }

        if (seedphrase && chain && network && address) {
            return navigate(`/${url}`);
        }

        return navigate('/import-wallet', { state: { email: user.email, seedphrase } });
    };

    const togglePaymentModalHandler = () => {
        setOpenPaymentModal(prev => !prev);
    };

    const handleChangeHandler = (e, nameField) => {
        const val = e.target.value;
        setIsData(prev => ({ ...prev, [nameField]: val }));
    };

    const payHandler = async (data) => {
        if (loading) return;
        data.paid = data.paid === 'unPaid' ? 'Paid' : 'unPaid';

        try {
            setLoading(true);
            const res = await dispatch(createPay(data));
            if (!res.bool) {
                setIsAuthError(true);
                setAuthInfo(res.message);
                setLoading(false);
                return;
            }

            setIsData(prev => ({
                ...prev,
                paid: res.message.paid
            }));
            setAuthInfo('The system will be updated to reflect your payment once it has been confirmed!');
            setIsAuthError(true);
            setLoading(false);
        } catch (error) {
            setIsAuthError(true);
            setAuthInfo(error.message || 'Something went wrong');
            setLoading(false);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        alert('Address copied to clipboard!');
    };

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

                {sidebarOpen && (
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isInvest={true} navigateMobileHandler={navigateMobileHandler} />
                )}

                <div className={styles.mainSection}>
                    <BackHeader
                        navigateHandler={navigateHandler}
                        openBuyModalFun={openBuyModalFun}
                        openSendModalFun={openSendModalFun}
                        title='Fund Details'
                    />

                    <div className={styles.tickerTape} style={{ margin: '0 10px' }}>
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

                    <div className={styles.seedWarning}>
                        Once the payment has been made to the crypto wallet address, scroll down and click the pay button for the system to confirm your payment
                    </div>

                    {isData && <div className={styles.card}>
                        {type === 'Bitcoin' && (
                            <div className={styles.formGroup}>
                                <label>Pay to the {type} wallet address below</label>
                                <div className={styles.inputCopyWrapper}>
                                    <input type="text" className={styles.input} value={admin.bitcoinwalletaddress} readOnly />
                                    <button onClick={() => handleCopy(admin.bitcoinwalletaddress)}>📋</button>
                                </div>
                            </div>
                        )}

                        {type === 'Ethereum' && (
                            <div className={styles.formGroup}>
                                <label>Pay to the {type} wallet address below</label>
                                <div className={styles.inputCopyWrapper}>
                                    <input type="text" className={styles.input} value={admin.ethereumwalletaddress} readOnly />
                                    <button onClick={() => handleCopy(admin.ethereumwalletaddress)}>📋</button>
                                </div>
                            </div>
                        )}

                        {type === 'Usdt' && (
                            <div className={styles.formGroup}>
                                <label>Pay to the {type} wallet address below</label>
                                <div className={styles.inputCopyWrapper}>
                                    <input type="text" className={styles.input} value={admin.usdt_walletaddress} readOnly />
                                    <button onClick={() => handleCopy(admin.usdt_walletaddress)}>📋</button>
                                </div>
                            </div>
                        )}

                        {type === 'Usdt Erc20' && (
                            <div className={styles.formGroup}>
                                <label>Pay to the {type} wallet address below</label>
                                <div className={styles.inputCopyWrapper}>
                                    <input type="text" className={styles.input} value={admin.usdt_erc20walletaddress} readOnly />
                                    <button onClick={() => handleCopy(admin.usdt_erc20walletaddress)}>📋</button>
                                </div>
                            </div>
                        )}

                        {type === 'Usdt Trc20' && (
                            <div className={styles.formGroup}>
                                <label>Pay to the {type} wallet address below</label>
                                <div className={styles.inputCopyWrapper}>
                                    <input type="text" className={styles.input} value={admin.usdt_trc20walletaddress} readOnly />
                                    <button onClick={() => handleCopy(admin.usdt_trc20walletaddress)}>📋</button>
                                </div>
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label>Amount($) to be paid </label>
                            <input type="number" className={styles.input} value={isData.amount || ''} onChange={(e) => handleChangeHandler(e, 'amount')} readOnly />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Deposit ID</label>
                            <input type="text" className={styles.input} value={isData.depositId || ''} onChange={(e) => handleChangeHandler(e, 'depositId')} readOnly />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Deposit Status</label>
                            <input type="text" className={styles.input} value={isData.status || ''} onChange={(e) => handleChangeHandler(e, 'status')} readOnly />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Payment method</label>
                            <input type="text" className={styles.input} value={isData.type || ''} onChange={(e) => handleChangeHandler(e, 'type')} readOnly />
                        </div>

                        <button className={styles.button} onClick={() => payHandler(isData)} style={{ backgroundColor: isData.paid === 'Paid' ? 'green' : '' }}>
                            {isData.paid === 'Paid' ? 'Paid' : 'Pay Now'}
                        </button>
                    </div>}
                </div>
            </div>
        </>
    );
};

export default DepositDetail;
