import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SendAsset.module.css';
import axios from 'axios';
import { FaArrowDown, FaArrowUp, FaExchangeAlt } from 'react-icons/fa';
import BuyModal from '../Modal/BuyModal';
import Transaction from '../components/Transaction';
import 'react-activity/dist/library.css';
import { Spinner } from 'react-activity';
import DesktopSideBar from '../components/DesktopSideBar';
import BackHeader from '../components/BackHeader';
import SendModal from '../Modal/SendModal';
import AuthModal from '../Modal/AuthModal';
import { useSelector } from 'react-redux';



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


const SendAsset = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openBuyModal, setOpenBuyModal] = useState(false);
  const [openSendModal, setOpenSendModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  

  const [isAuthError, setIsAuthError] = useState(false);
  const [authInfo, setAuthInfo] = useState("");
  let { user, seedphrase, chain, network, address } = useSelector(state => state.userAuth)


   const updateAuthError = () => {
        setIsAuthError(prev => !prev);
        setAuthInfo('')
    }





  const navigate = useNavigate();

  const filteredCrypto = cryptoData.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const cryptoIds = [
    "bitcoin",         // BTC ✅
    "ethereum",        // ETH
    "binancecoin",     // BNB
    "polygon",         // MATIC
    "avalanche-2",     // AVAX
    "fantom",          // FTM
    "cronos",          // CRO
    "xdai",            // xDAI (Gnosis)
    "celo",            // CELO
    "moonbeam",        // GLMR
    "moonriver",       // MOVR
    "harmony",         // ONE
    "metis-token",     // METIS
    "kava",            // KAVA
    "base",            // Base
    "zksync",          // zkSync Era
    "linea",           // Linea
    "scroll"           // Scroll
  ];

  useEffect(() => {
    const fetchCryptoData = async () => {
      if (loading) return;

      try {
        setLoading(true);

        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              ids: cryptoIds.join(","), // 🔥 Now includes Bitcoin
              order: "market_cap_desc",
              per_page: cryptoIds.length,
              page: 1,
            },
          }
        );

        setCryptoData(response.data);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      } finally {
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

  const sendHandler = (data) => {
    navigate('/send', { state: { symbol: data.symbol, name: data.name, data: data } });
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
      {openBuyModal && <BuyModal buyFun={buyFunction} sellFun={sellFunction} />}
      {openSendModal && <SendModal sendFun={sendFunction} receiveFun={receiveFunction} />}
      {isAuthError && <AuthModal modalVisible={isAuthError} updateVisibility={updateAuthError} message={authInfo} />}

      <div className={styles.dashboard}>
        <div className={styles.leftSection}>
          <DesktopSideBar navigateMobileHandler={navigateMobileHandler} />
        </div>

        <div className={styles.mainSection}>
          {/* ✅ BackHeader used here instead of manual header */}
          <BackHeader
            navigateHandler={navigateHandler}
            openBuyModalFun={openBuyModalFun}
            openSendModalFun={openSendModalFun}
            title='Select Asset'
          />

          <div className={styles.dashboardContent}>
            <div className={styles.dashboardContentleft}>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search asset..."
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className={styles.cryptoList}>
                {!loading ? (
                  filteredCrypto.map((coin) => (
                    <div
                      onClick={() => sendHandler(coin)}
                      key={coin.id}
                      className={styles.cryptoItem}
                    >
                      <div className={styles.coinInfo}>
                        <img src={coin.image} alt={coin.name} className={styles.coinImage} />
                        <div>
                          <div className={styles.coinName}>{coin.name}</div>
                          <div className={styles.coinSymbol}>{coin.symbol.toUpperCase()}</div>
                        </div>
                      </div>
                      <div
                        className={styles.coinPrice}
                        style={{
                          color: coin.price_change_percentage_24h >= 0 ? 'green' : 'red'
                        }}
                      >
                        ${coin.current_price.toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '150px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingBottom: '20px'
                    }}
                  >
                    <Spinner size={24} color="#4F46E5" speed={0.5} animating={true} />
                  </div>
                )}
              </div>
            </div>

            <div className={styles.dashboardContentright}>
              <Transaction transactions={transactions} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SendAsset;

