import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Withdraw.module.css';
import BuyModal from '../Modal/BuyModal';
import Sidebar from '../components/MobileSideBar';
import DesktopSideBar from '../components/DesktopSideBar';
import SendModal from '../Modal/SendModal';
import AuthModal from '../Modal/AuthModal';
import BackHeader from '../components/BackHeader';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from 'react-activity';
import { createWithdraw, fetchWithdraw } from '../store/action/appStorage';
import { idbGet,idbRemove,idbSet } from '../store/action/appStorage';


const Withdraw = () => {
    const [loading, setLoading] = useState(true);
    const [isAuthError, setIsAuthError] = useState(false);
    const [authInfo, setAuthInfo] = useState('');
    const [cryptoData, setCryptoData] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);

    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('');

    // dynamic fields
    const [accountName, setAccountName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [bankName, setBankName] = useState('');
    const [bitcoinAddress, setBitcoinAddress] = useState('');
    const [ethereumAddress, setEthereumAddress] = useState('');
    
    

    const [openBuyModal, setOpenBuyModal] = useState(false);
    const [openSendModal, setOpenSendModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const dispatch = useDispatch();
    const { user, seedphrase, chain, network, address } = useSelector(state => state.userAuth);
    const navigate = useNavigate();

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




    const handleWithdraw = async () => {
        if (loading) return;
        if (!amount || !method) {
            setAuthInfo('Please fill in required fields');
            setIsAuthError(true);
            return;
        }

        if (!user.accountStatus) {
            setAuthInfo('Account not yet veririfed');
            setIsAuthError(true);
            return;
        }

        if (Number(user.availableBalance) < Number(amount)) {
            setAuthInfo('Insufficient fund');
            setIsAuthError(true);
            return;
        }

        let data = {
            amount,
            method,
            user,
            account_name: accountName,
            account_number: accountNumber,
            bank_name: bankName,
            bitcoin_address: bitcoinAddress,
            ethereum_address: ethereumAddress,
            
        };

        try {
            setLoading(true);
            const res = await dispatch(createWithdraw(data));
            if (!res.bool) {
                setIsAuthError(true);
                return setAuthInfo(res.message);
            }

            setIsAuthError(true);
            setWithdrawals(res.message);
            setAuthInfo("Withdrawal initiated.");
            setLoading(false);
            fetchWithdrawHandler();

            // ✅ Clear all input fields
            setAmount('');
            setMethod('');
            setAccountName('');
            setAccountNumber('');
            setBankName('');
            setBitcoinAddress('');
            setEthereumAddress('');
            setCashappAddress('');
            setZelleAddress('');
        } catch (error) {
            setIsAuthError(true);
            setAuthInfo(error.message);
            setLoading(false);
        }
    };






    const fetchWithdrawHandler = async () => {
        try {
            setLoading(true);
            const res = await dispatch(fetchWithdraw({ user }));
            if (!res.bool) {
                setAuthInfo(res.message);
                setIsAuthError(true);
                setLoading(false);
                return;
            }
            setWithdrawals(res.message);
            setLoading(false);
        } catch (err) {
            setAuthInfo(err.message);
            setIsAuthError(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawHandler();
    }, []);

    const updateAuthError = () => {
        setIsAuthError(false);
        setAuthInfo('');
    };

    const navigateHandler = () => {
        navigate(-1);
    };

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
    }

    return (
        <>
            {isAuthError && <AuthModal modalVisible={isAuthError} updateVisibility={updateAuthError} message={authInfo} />}
            {openBuyModal && <BuyModal buyFun={() => setOpenBuyModal(false)} sellFun={() => setOpenBuyModal(false)} />}
            {openSendModal && <SendModal sendFun={() => setOpenSendModal(false)} receiveFun={() => setOpenSendModal(false)} />}

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
                        openBuyModalFun={() => setOpenBuyModal(true)}
                        openSendModalFun={() => setOpenSendModal(true)}
                        title='Withdraw Fund'
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

                    {!loading ? (
                        <div className={styles.container}>
                            <div className={styles.card}>
                                <div className={styles.formGroup}>
                                    <input
                                        type="number"
                                        placeholder="Amount in dollars"
                                        className={styles.input}
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <select className={styles.select} value={method} onChange={(e) => setMethod(e.target.value)}>
                                        <option value="">Receive Payment through</option>
                                        <option value="bank">Bank</option>
                                        <option value="bitcoin">Bitcoin</option>
                                        <option value="ethereum">Ethereum</option>
                                        
                                        </select>
                                </div>

                                {method === 'bank' && (
                                    <>
                                        <div className={styles.formGroup}>
                                            <input
                                                placeholder="Account Name"
                                                className={styles.input}
                                                value={accountName}
                                                onChange={(e) => setAccountName(e.target.value)}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <input
                                                placeholder="Account Number"
                                                className={styles.input}
                                                value={accountNumber}
                                                onChange={(e) => setAccountNumber(e.target.value)}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <input
                                                placeholder="Bank Name"
                                                className={styles.input}
                                                value={bankName}
                                                onChange={(e) => setBankName(e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}

                                {method === 'bitcoin' && (
                                    <div className={styles.formGroup}>
                                        <input
                                            placeholder="Bitcoin Address"
                                            className={styles.input}
                                            value={bitcoinAddress}
                                            onChange={(e) => setBitcoinAddress(e.target.value)}
                                        />
                                    </div>
                                )}


                                {method === 'ethereum' && (
                                    <div className={styles.formGroup}>
                                        <input
                                            placeholder="Ethereum Address"
                                            className={styles.input}
                                            value={ethereumAddress}
                                            onChange={(e) => setEthereumAddress(e.target.value)}
                                        />
                                    </div>
                                )}

                                <button className={styles.button} onClick={handleWithdraw}>
                                    Withdraw
                                </button>
                            </div>

                            <div className={styles.historyCard}>

                                {withdrawals.length === 0 ? (
                                    <p className={styles.emptyText}>No withdrawals found.</p>
                                ) : (
                                    <div className={styles.tableWrapper}>
                                        <table className={styles.tradeTable}>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Date</th>
                                                    <th>Amount</th>
                                                    <th>Method</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {withdrawals.map((item, index) => (
                                                    <tr key={item._id || index}>
                                                        <td>#{index + 1}</td>
                                                        <td>{new Date(item.date).toLocaleDateString()}</td>
                                                        <td>{item.amount}</td>
                                                        <td style={{ color: '#10B981', fontWeight: 'bold' }}>{item.method}</td>
                                                        <td style={{ color: item.status === 'Pending' ? '#EF4444' : '#10B981', fontWeight: 'bold' }}>
                                                            {item.status}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            width: '100%',
                            height: '300px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingBottom: '20px'
                        }}>
                            <Spinner size={24} color="#4F46E5" speed={0.5} animating={true} />
                        </div>
                    )}
                </div>
            </div >
        </>
    );
};

export default Withdraw;
