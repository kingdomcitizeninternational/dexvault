import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Trade-center.module.css';
import BuyModal from '../Modal/BuyModal';
import Sidebar from '../components/MobileSideBar';
import 'react-activity/dist/library.css';
import DesktopSideBar from '../components/DesktopSideBar';
import SendModal from '../Modal/SendModal';
import AuthModal from '../Modal/AuthModal';
import AOS from 'aos';
import 'aos/dist/aos.css';
import BackHeader from '../components/BackHeader';
import { SpinnerModal } from '../Modal/SpinnerModal';
import { fetchTrade } from '../store/action/appStorage';
import { useDispatch, useSelector } from 'react-redux';
import { idbGet,idbRemove,idbSet } from '../store/action/appStorage';


const TradeCenter = () => {
    const [cryptoData, setCryptoData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openBuyModal, setOpenBuyModal] = useState(false);
    const [openSendModal, setOpenSendModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [isAuthError, setIsAuthError] = useState(false);
    const [authInfo, setAuthInfo] = useState('');
    const [trades, setTrades] = useState([]);
    let { user, seedphrase, chain, network, address } = useSelector(state => state.userAuth)
    const dispatch = useDispatch();
    
 

    const buttonRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ x: 50, y: 50 });

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

    const asyncall = async () => {
        if (loading) return;
        try {
            setLoading(true);
            const res = await dispatch(fetchTrade(user));
            if (!res.bool) {
                setAuthInfo(res.message);
                setIsAuthError(true);
                setLoading(false);
                return;
            }
            setTrades(res.message);
            setLoading(false);
        } catch (err) {
            setAuthInfo(err.message);
            setIsAuthError(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        asyncall();
    }, []);

    const currencies = [
        { symbol: 'BTCUSD', name: 'BTCUSD', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=025', color: '#f7931a' },
        { symbol: 'ETHUSD', name: 'ETHUSD', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=025', color: '#627eea' },
        { symbol: 'EURUSD', name: 'EUR/USD', icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg', color: '#1a1aff' },
        { symbol: 'GBPUSD', name: 'GBP/USD', icon: 'https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg', color: '#ff4d4f' },
        { symbol: 'XAUUSD', name: 'GOLD', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=025', color: '#ff9900' },
    ];

    const Card = ({ symbol, name, icon }) => {
        const handleImageError = (e) => {
            // Set a fallback image if the icon fails to load
            e.target.src = 'https://via.placeholder.com/40'; // A simple placeholder image for fallback
        };
    
        return (
            <div
                className={styles.card}
                style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '20px',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <div className={styles.cardHeader} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <img
                        src={icon}
                        alt={name}
                        className={styles.icon}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginRight: '12px',
                        }}
                        onError={handleImageError} // Set fallback image on error
                    />
                    <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>{name}</strong>
                        <span
                            style={{
                                display: 'block',
                                fontSize: '14px',
                                color: '#888',
                                marginTop: '4px',
                            }}
                        >
                            US Dollar
                        </span>
                    </div>
                </div>
                <div className={styles.priceSection}>
                    <div className={styles.priceChart} style={{ marginTop: '15px' }}>
                        <div
                            className="tradingview-widget-container"
                            style={{
                                height: '100px',
                                width: '100%',
                                borderRadius: '8px',
                                overflow: 'hidden',
                            }}
                        >
                            <iframe
                                title={symbol}
                                src={`https://s.tradingview.com/embed-widget/mini-symbol-overview/?symbol=FX:${symbol}&locale=en`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    borderRadius: '8px',
                                }}
                                allowtransparency="true"
                                scrolling="no"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    
    

    const updateAuthError = () => {
        setIsAuthError(false);
        setAuthInfo('');
    };

    const openBuyModalFun = () => setOpenBuyModal(true);
    const openSendModalFun = () => setOpenSendModal(true);
    const buyFunction = () => setOpenBuyModal(false);
    const sellFunction = () => setOpenBuyModal(false);
    const sendFunction = () => setOpenSendModal(false);
    const receiveFunction = () => setOpenSendModal(false);
    const navigateHandler = () => navigate(-1);

    const handleMouseDown = (e) => {
        setDragging(true);
        buttonRef.current.initialX = e.clientX - position.x;
        buttonRef.current.initialY = e.clientY - position.y;
    };

    const handleMouseMove = (e) => {
        if (!dragging) return;
        const newX = e.clientX - buttonRef.current.initialX;
        const newY = e.clientY - buttonRef.current.initialY;
        setPosition({ x: newX, y: newY });
    };
    const handleMouseUp = () => setDragging(false);

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging]);


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

    };;



    return (
        <>
            {isAuthError && <AuthModal modalVisible={isAuthError} updateVisibility={updateAuthError} message={authInfo} />}
            {openBuyModal && <BuyModal buyFun={buyFunction} sellFun={sellFunction} />}
            {openSendModal && <SendModal sendFun={sendFunction} receiveFun={receiveFunction} />}

            <div className={styles.dashboard}>
                <div className={styles.leftSection}>
                    <DesktopSideBar isInvest={true}  navigateMobileHandler={navigateMobileHandler}/>
                </div>

                {sidebarOpen && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isInvest={true} />}

                <div className={styles.mainSection}>
                    <BackHeader
                        navigateHandler={navigateHandler}
                        openBuyModalFun={openBuyModalFun}
                        openSendModalFun={openSendModalFun}
                        title='Trade Center'
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

                    {loading ? (
                        <div style={{ marginTop: '50px' }}><SpinnerModal /></div>
                    ) : (
                        <>
                            <div className={styles.tradeSummaryCard}>
                                <button
                                    ref={buttonRef}
                                    onMouseDown={handleMouseDown}
                                    className={styles.ctaButton}
                                    style={{
                                        position: 'absolute',
                                        left: position.x,
                                        top: position.y,
                                        cursor: dragging ? 'grabbing' : 'grab',
                                        zIndex: 1000
                                    }}
                                >
                                    Create active trade
                                </button>

                                <div className={styles.tableWrapper}>
    <table
        className={styles.tradeTable}
        style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: "'ABeeZee', sans-serif",
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
        }}
    >
        <thead>
            <tr style={{ backgroundColor: '#f8f8f8', borderBottom: '2px solid #ddd' }}>
                
                <th
                    style={{
                        padding: '12px 15px',
                        textAlign: 'left',
                        fontSize: '18px', // Increased font size
                        fontWeight: '600',
                        color: '#333',
                    }}
                >
                    ID
                </th>
                <th
                    style={{
                        padding: '12px 15px',
                        textAlign: 'left',
                        fontSize: '18px', // Increased font size
                        fontWeight: '600',
                        color: '#333',
                    }}
                >
                    Date
                </th>
                <th
                    style={{
                        padding: '12px 15px',
                        textAlign: 'left',
                        fontSize: '18px', // Increased font size
                        fontWeight: '600',
                        color: '#333',
                    }}
                >
                    Pair
                </th>
                <th
                    style={{
                        padding: '12px 15px',
                        textAlign: 'left',
                        fontSize: '18px', // Increased font size
                        fontWeight: '600',
                        color: '#333',
                    }}
                >
                    Profit
                </th>
                <th
                    style={{
                        padding: '12px 15px',
                        textAlign: 'left',
                        fontSize: '18px', // Increased font size
                        fontWeight: '600',
                        color: '#333',
                    }}
                >
                    Loss
                </th>
            </tr>
        </thead>
        <tbody>
            {trades.map((data, index) => (
                <tr
                    key={index}
                    style={{
                        borderBottom: '1px solid #f1f1f1',
                        backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff',
                    }}
                >
                    <td
                        style={{
                            padding: '15px 20px', // Increased padding
                            fontSize: '16px', // Increased font size
                            textAlign: 'left',
                            color: '#333',
                        }}
                    >
                        {index + 1}
                    </td>
                    <td
                        style={{
                            padding: '15px 20px', // Increased padding
                            fontSize: '16px', // Increased font size
                            textAlign: 'left',
                            color: '#333',
                        }}
                    >
                        {data.date}
                    </td>
                    <td
                        style={{
                            padding: '15px 20px', // Increased padding
                            fontSize: '16px', // Increased font size
                            textAlign: 'left',
                            color: '#333',
                        }}
                    >
                        {data.pair}
                    </td>
                    <td
                        style={{
                            padding: '15px 20px', // Increased padding
                            fontSize: '16px', // Increased font size
                            fontWeight: 'bold',
                            color: '#10B981',
                            textAlign: 'left',
                        }}
                    >
                        {user.currency || '$'}{data.profit}
                    </td>
                    <td
                        style={{
                            padding: '15px 20px', // Increased padding
                            fontSize: '16px', // Increased font size
                            fontWeight: 'bold',
                            color: '#EF4444',
                            textAlign: 'left',
                        }}
                    >
                        {user.currency || '$'}{data.loss}
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>




                                {trades.length === 0 && (
                                    <div className={styles.historyCard}>
                                        <h3 className={styles.sectionTitle}>My Trades</h3>
                                        <p className={styles.emptyText}>No Trade found.</p>
                                    </div>
                                )}
                            </div>

                            <div className={styles.dashboardWrapper}>
                                <div className={styles.scrollingWrapper}>
                                    {currencies.map((currency) => (
                                        <Card key={currency.symbol} {...currency} />
                                    ))}
                                </div>
                            </div>

                            <div className={styles.dashboardWrapper}>
                                <iframe
                                    src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_b64f2&symbol=BITSTAMP%3ABTCUSD&interval=D&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=Light&style=1&timezone=Etc%2FUTC&locale=en&utm_source=localhost"
                                    width="100%"
                                    height="500"
                                    allowtransparency="true"
                                    frameBorder="0"
                                ></iframe>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default TradeCenter;
