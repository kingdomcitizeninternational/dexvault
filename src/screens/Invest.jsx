import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './invest.module.css';
import { FaPaperPlane } from 'react-icons/fa'; // Sell and Send icons
import axios from 'axios'; // Import Axios for API requests
import Token from '../components/Token';
import MarketTrend from '../components/MarketTrend';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { FaArrowDown, FaArrowUp, FaExchangeAlt } from 'react-icons/fa';
import BuyModal from '../Modal/BuyModal';
import Sidebar from '../components/MobileSideBar';
import BottomTabs from '../components/BottomTabs';
import { MdArrowDownward } from 'react-icons/md';
import { FaPlus, FaMinus } from 'react-icons/fa';
import Transaction from '../components/Transaction';
import 'react-activity/dist/library.css'; // 
import { Spinner } from 'react-activity';
import DesktopSideBar from '../components/DesktopSideBar';
import DesktopHeader from '../components/DashboardHeader'
import SendModal from '../Modal/SendModal';
import LoadingSkeleton from '../components/Loader';
import AuthModal from '../Modal/AuthModal';
import { useDispatch, useSelector } from 'react-redux';
import { getToken } from '../store/action/appStorage';
import { evmChains } from '../utils/utils';



const data = [
    { name: 'Bitcoin', value: 40 },
    { name: 'Ethereum', value: 35 },
    { name: 'Others', value: 25 }
];

const COLORS = ['#FF9900', '#3C3CFF', '#8E44AD'];

const transactions = [
    {
        id: 1,
        type: 'Received',
        asset: 'BTC',
        amount: '+0.005',
        date: 'Apr 6, 2025',
        icon: <FaArrowDown className={styles.iconReceived} />
    },
    {
        id: 2,
        type: 'Sent',
        asset: 'ETH',
        amount: '-0.2',
        date: 'Apr 5, 2025',
        icon: <FaArrowUp className={styles.iconSent} />
    },
    {
        id: 3,
        type: 'Swap',
        asset: 'USDT to BTC',
        amount: '$250',
        date: 'Apr 4, 2025',
        icon: <FaExchangeAlt className={styles.iconSwap} />
    }
];


const Invest = () => {
    const [cryptoData, setCryptoData] = useState([]);
    const [token, setToken] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('tab1');
    const [openBuyModal, setOpenBuyModal] = useState(false);
    const [openSendModal, setOpenSendModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate()
    const [isAuthError, setIsAuthError] = useState(false);
    const [authInfo, setAuthInfo] = useState("");
    const [ticker, setTicker] = useState("");
    const [balance, setBalance] = useState("");
    let { user, seedphrase, chain, network, address } = useSelector(state => state.userAuth)
    const dispatch = useDispatch()

    useEffect(() => {
        for (let m of evmChains) {
            if (m.chainHex === chain) {
                setTicker(m.ticker)
            }
        }
    })

    // Fetch crypto data from CoinGecko API
    const fetchCryptoData = async () => {
        if (loading) {
            return
        }

        try {
            setLoading(true)
            const response = await axios.get(
                'https://api.coingecko.com/api/v3/coins/markets', {
                /*params: {
                    vs_currency: 'usd', // Convert prices to USD
                    ids: 'bitcoin,ethereum,ripple,litecoin,cardano', // List of coin ids to fetch
                }*/
                params: {
                    vs_currency: 'usd', // Convert prices to USD
                    order: 'market_cap_desc', // Optional: order by market cap
                    per_page: 20, // Fetch 50 coins
                    page: 1 // First page
                }
            }

            );

            setCryptoData(response.data);
            setLoading(false);

        } catch (error) {
            console.log('Error fetching crypto data:', error);
            setLoading(false);
        }
    };

    //fetching tokens from network 
    const fetchTokens = async () => {
        if (loading) {
            return
        }
        try {
            setLoading(true)
            const res = await dispatch(getToken())
            if (!res.bool) {
                setIsAuthError(true);
                setAuthInfo(res.message);
            }
            setLoading(false)
            setToken(res.message.tokens)
            setBalance(res.message.balance)
        } catch (error) {
            setIsAuthError(true);
            setAuthInfo(error.message);
        }
    };



    useEffect(() => {
        fetchCryptoData();
        fetchTokens()
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

    const sendHandler = () => {
        navigate('/send-assets')
    }


    const actionHandler = (data) => {
        if (data === 'receive') {
            return navigate('/receive')
        }
        navigate(`/${data}`)
    }

    const notificationHandler = () => {
        navigate('/notifications')
    }

    if (loading) {
        return <LoadingSkeleton />
    }


    const navigateTabHandler = (url) => {
        if (url === 'dashboard') {
            if (user.walletFeauture) {
                setIsAuthError(true)
                setAuthInfo('Wallet feature is not enabled yet on this account')
                return

            } else {

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


            }


        }
        navigate(`/${url}`)
    }


    const navigateMobileHandler = (url) => {
       
        if (url === 'dashboard') {
            if (user.walletFeauture) {
                setIsAuthError(true)
                setAuthInfo('Wallet feature is not enabled yet on this account')
                return
            } else {
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


            }


        }
        navigate(`/${url}`)
    };



    return (
        <>
            {isAuthError && <AuthModal modalVisible={isAuthError} updateVisibility={updateAuthError} message={authInfo} />}
            {openBuyModal && <BuyModal buyFun={buyFunction} sellFun={sellFunction} />}
            {openSendModal && <SendModal sendFun={sendFunction} receiveFun={receiveFunction} />}

            <div className={styles.dashboard}>
                <div className={styles.leftSection}>
                    <DesktopSideBar isInvest={true}/>
                </div>

                {/*  sidebar content */}
                {sidebarOpen && (
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isInvest={true} navigateMobileHandler={navigateMobileHandler}/>
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
                        <div className={styles.mobileMainSection}>
                            <div className={styles.balanceSection}>
                                <div className={styles.balanceCard}>
                                    <p className={styles.amount}>{balance}{ticker}</p>
                                    <p className={styles.amounttext}>Your wallet balance</p>

                                    <div className={styles.balanceActionContainer}>
                                        <button onClick={() => actionHandler('buy-assets')}>
                                            <FaPlus size={18} /> Buy
                                        </button>
                                        <button onClick={() => actionHandler('sell-assets')}>
                                            <FaMinus size={18} /> Sell
                                        </button>
                                        <button onClick={() => actionHandler('send-assets')}>
                                            <FaPaperPlane size={18} onClick={sendHandler} /> Send
                                        </button>
                                        <button onClick={() => actionHandler('receive')}>
                                            <MdArrowDownward size={18} /> Receive
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* Switchable Tabs */}
                            <div className={styles.tabsContainer}>
                                <div className={styles.tabs}>
                                    <button
                                        className={activeTab === 'tab1' ? styles.activeTab : ''}
                                        onClick={() => setActiveTab('tab1')}
                                    >
                                        Token
                                    </button>
                                    <button
                                        className={activeTab === 'tab2' ? styles.activeTab : ''}
                                        onClick={() => setActiveTab('tab2')}
                                    >
                                        Market Trends
                                    </button>
                                </div>

                                {/* Tab Content */}
                                <div className={styles.tabContent}>
                                    {activeTab === 'tab2' && (
                                        loading ? (
                                            <div style={{
                                                width: '100%',
                                                height: '150px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                paddingBottom: '20px'
                                            }}>
                                                <Spinner size={24} color="#4F46E5" speed={0.5} animating={true} />
                                            </div>
                                        ) : (
                                            <Token data={cryptoData} />
                                        )
                                    )}

                                    {activeTab === 'tab1' && (
                                        loading ? (
                                            <div style={{
                                                width: '100%',
                                                height: '150px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                paddingBottom: '20px'
                                            }}>
                                                <Spinner size={24} color="#4F46E5" speed={0.5} animating={true} />
                                            </div>
                                        ) : (
                                            <MarketTrend data={token} />
                                        )
                                    )}
                                </div>


                            </div>

                        </div>

                        <div className={styles.desktopMainSection}>

                            <div className={styles.desktopMainSectionleft}>
                                <div className={styles.desktopbalanceSection}>
                                    <p className={styles.desktopamounttext}>Your wallet balance</p>
                                    <div className={styles.desktopbalanceCard}>
                                        <p className={styles.desktopamount}>{balance}{ticker}</p>

                                    </div>
                                </div>

                                <div className={styles.desktoptabsContainer}>
                                    <div className={styles.desktoptabssection}>
                                        <p>Price</p>
                                        <select onChange={(e) => {
                                            if (e.target.value === 'Token') {
                                                setActiveTab('tab2');
                                            } else if (e.target.value === 'Market trend') {
                                                setActiveTab('tab1');
                                            }
                                        }}>
                                            <option value="Token">Token</option>
                                            <option value="Market trend">Market trend</option>
                                        </select>

                                    </div>


                                </div>

                                {/* desktoptab content*/}
                                <div className={styles.desktoptabContent}>
                                    {activeTab === 'tab1' && (
                                        loading ? (
                                            <div style={{
                                                width: '100%',
                                                height: '150px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                paddingBottom: '20px'
                                            }}>
                                                <Spinner size={24} color="#4F46E5" speed={0.5} animating={true} />
                                            </div>
                                        ) : (
                                            <Token data={cryptoData} />
                                        )
                                    )}
                                    {activeTab === 'tab2' && (
                                        loading ? (
                                            <div style={{
                                                width: '100%',
                                                height: '150px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                paddingBottom: '20px'
                                            }}>
                                                <Spinner size={24} color="#4F46E5" speed={0.5} animating={true} />
                                            </div>
                                        ) : (
                                            <MarketTrend data={token} />
                                        )
                                    )}
                                </div>

                            </div>
                            <div className={styles.desktopMainSectionright}>

                                <div className={styles.rightPanel}>

                                    <div className={styles.card}>
                                        <h3 className={styles.heading}>Portfolio Breakdown</h3>
                                        <ResponsiveContainer width="100%" height={200}>
                                            <PieChart>
                                                <Pie
                                                    data={data}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={60}
                                                    label
                                                >
                                                    {data.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <Transaction transactions={transactions} />
                                </div>
                            </div>
                        </div>



                    </div>


                </div>
            </div>

            <BottomTabs navigateTabHandler={navigateTabHandler}/>
        </>

    );
};

export default Invest;
