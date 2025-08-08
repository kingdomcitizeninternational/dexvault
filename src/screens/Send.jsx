import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Send.module.css';
import { FaArrowDown, FaArrowUp, FaExchangeAlt } from 'react-icons/fa';
import BuyModal from '../Modal/BuyModal';
import SendModal from '../Modal/SendModal';
import Transaction from '../components/Transaction';
import 'react-activity/dist/library.css';
import DesktopSideBar from '../components/DesktopSideBar';
import BackHeader from '../components/BackHeader';
import LoadingSkeleton from '../components/Loader';
import AuthModal from '../Modal/AuthModal';
import { chainInfo, sendBtcTansaction, sendtansaction } from '../store/action/appStorage';
import { useDispatch, useSelector } from 'react-redux';
import { evmChains } from '../utils/utils';
import Spinner from "react-activity/dist/Spinner"
import "react-activity/dist/Spinner.css";
import { ethers } from 'ethers';
import { idbGet,idbRemove,idbSet } from '../store/action/appStorage';

const evm = [
  {
    name: "Bitcoin",
    ticker: "BTC",
    chainId: 'btc',
    chainHex: "btc",
    rpcUrl: '' // Bitcoin is not EVM-compatible; handle separately
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1696501628',
    chainId: 1,
    chainHex: '0x1',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/demo'
  },
  {
    id: 'binancecoin',
    symbol: 'bnb',
    name: 'BNB',
    image: 'https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1696501970',
    chainId: 56,
    chainHex: '0x38',
    rpcUrl: 'https://bsc-dataseed.binance.org'
  },
  {
    id: 'avalanche-2',
    symbol: 'avax',
    name: 'Avalanche',
    image: 'https://coin-images.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png?1696512369',
    chainId: 43114,
    chainHex: '0xa86a',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc'
  },
  {
    id: 'kava',
    symbol: 'kava',
    name: 'Kava',
    image: 'https://coin-images.coingecko.com/coins/images/9761/large/kava.png?1696509822',
    chainId: 2222,
    chainHex: '0x8ae',
    rpcUrl: 'https://evm.kava.io'
  },
  {
    id: 'zksync',
    symbol: 'zk',
    name: 'zkSync',
    image: 'https://coin-images.coingecko.com/coins/images/38043/large/ZKTokenBlack.png?1718614502',
    chainId: 324,
    chainHex: '0x144',
    rpcUrl: 'https://mainnet.era.zksync.io'
  },
  {
    id: 'celo',
    symbol: 'celo',
    name: 'Celo',
    image: 'https://coin-images.coingecko.com/coins/images/11090/large/InjXBNx9_400x400.jpg?1696511031',
    chainId: 42220,
    chainHex: '0xa4ec',
    rpcUrl: 'https://forno.celo.org'
  },
  {
    id: 'harmony',
    symbol: 'one',
    name: 'Harmony',
    image: 'https://coin-images.coingecko.com/coins/images/4344/large/Y88JAze.png?1696504947',
    chainId: 1666600000,
    chainHex: '0x64000000',
    rpcUrl: 'https://api.harmony.one'
  },
  {
    id: 'metis-token',
    symbol: 'metis',
    name: 'Metis',
    image: 'https://coin-images.coingecko.com/coins/images/15595/large/Metis_Black_Bg.png?1702968192',
    chainId: 1088,
    chainHex: '0x440',
    rpcUrl: 'https://andromeda.metis.io/?owner=1088'
  },
  {
    id: 'moonbeam',
    symbol: 'glmr',
    name: 'Moonbeam',
    image: 'https://coin-images.coingecko.com/coins/images/22459/large/Moonbeam_GLMR_ICON.png?1716647586',
    chainId: 1284,
    chainHex: '0x504',
    rpcUrl: 'https://rpc.api.moonbeam.network'
  },
  {
    id: 'moonriver',
    symbol: 'movr',
    name: 'Moonriver',
    image: 'https://coin-images.coingecko.com/coins/images/17984/large/Moonriver_MOVR_ICON.png?1716647589',
    chainId: 1285,
    chainHex: '0x505',
    rpcUrl: 'https://rpc.api.moonriver.moonbeam.network'
  },
  {
    id: 'scroll',
    symbol: 'scr',
    name: 'Scroll',
    image: 'https://coin-images.coingecko.com/coins/images/50571/large/scroll.jpg?1728376125',
    chainId: 534353,
    chainHex: '0x81e31',
    rpcUrl: 'https://rpc.scroll.io'
  },
  {
    id: 'fantom',
    symbol: 'ftm',
    name: 'Fantom',
    image: 'https://coin-images.coingecko.com/coins/images/4001/large/Fantom_round.png?1696504642',
    chainId: 250,
    chainHex: '0xfa',
    rpcUrl: 'https://rpcapi.fantom.network'
  },
  {
    id: 'xdai',
    symbol: 'xdai',
    name: 'Gnosis',
    image: 'https://coin-images.coingecko.com/coins/images/11062/large/Identity-Primary-DarkBG.png?1696511004',
    chainId: 100,
    chainHex: '0x64',
    rpcUrl: 'https://rpc.gnosischain.com'
  },
  {
    id: 'base',
    symbol: 'base',
    name: 'Base',
    image: 'https://coin-images.coingecko.com/coins/images/31154/large/8d00-e29fe2ee768c-removebg-preview.png?1696530026',
    chainId: 8453,
    chainHex: '0x2105',
    rpcUrl: 'https://mainnet.base.org'
  }
];



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



const Send = () => {
  const [loading, setLoading] = useState(true);
  const [openBuyModal, setOpenBuyModal] = useState(false);
  const [openSendModal, setOpenSendModal] = useState(false);
  const [isAuthError, setIsAuthError] = useState(false);
  const [authInfo, setAuthInfo] = useState("");
  const [balance, setBalance] = useState("");
  const [chain, setChain] = useState("");
  const [sendLoader, setSendLoader] = useState("");
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [hash, setHash] = useState(null);
  const dispatch = useDispatch();
  let { address, seedphrase, user, network } = useSelector(state => state.userAuth);
  const openBuyModalFun = () => setOpenBuyModal(true);
  const openSendModalFun = () => setOpenSendModal(true);
  const buyFunction = () => setOpenBuyModal(false);
  const sellFunction = () => setOpenBuyModal(false);
  const sendFunction = () => setOpenSendModal(false);
  const receiveFunction = () => setOpenSendModal(false);
  const navigateHandler = () => navigate(-1);
  const navigate = useNavigate();
  const location = useLocation();

  const { symbol, name } = location.state;

  const updateAuthError = () => {
    setIsAuthError(prev => !prev);
    setAuthInfo('');
  };

  const fetchBalance = async () => {
    //check for chain ... if not bitcoin,,,, resimulate address
    if (chain !== 'btc') {
      address = ethers.Wallet.fromPhrase(seedphrase).address
    }
    try {
      if (!address) navigate('/login');
      const res = await dispatch(chainInfo(chain, address, network, seedphrase));
      if (!res.bool) {
        setIsAuthError(true);
        setAuthInfo(res.message);
      }
      setLoading(false);
      setBalance(res.message.balance);
    } catch (error) {
      setLoading(false);
      setIsAuthError(true);
      setAuthInfo(error.message);
    }
  };

  useEffect(() => {
    const setupAndFetch = async () => {
      let foundCoin = false;
      for (let m of evm) {
        if (m.name.toLowerCase() === name.toLowerCase()) {
          setChain(m.chainHex);
          foundCoin = true;
          break;
        }
      }
      if (!foundCoin) {
        setChain('btc');
      }
    };
    setupAndFetch();
  }, [name, evm]);

  useEffect(() => {
    if (!chain) return;
    fetchBalance();
  }, [chain]);

  if (loading) return <LoadingSkeleton />;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (sendLoader) return;
    setSendLoader(true);

    if (chain === 'btc') {
      const res = await dispatch(sendBtcTansaction(chain, address, network, seedphrase, amount, balance, recipientAddress));
      if (!res.bool) {
        setSendLoader(false);
        setIsAuthError(true);
        return setAuthInfo(res.message);
      }
      setIsAuthError(true);
      setLoading(false);
      return setAuthInfo(res.message);
    }

    const userBalance = ethers.parseEther(balance.toString()); // balance in wei
    const sendAmount = ethers.parseEther(amount.toString());   // amount in wei

    if (sendAmount > userBalance) {
      setSendLoader(false);
      setIsAuthError(true);
      return setAuthInfo('Insufficient balance to send this amount');
    }


    let chainObj = evmChains.find(data => data.chainHex === chain);
    if (!chainObj || !chainObj.rpcUrl) {
      setIsAuthError(true);
      setSendLoader(false);
      return setAuthInfo(`Failed transaction`);
    }

    try {
      const provider = new ethers.JsonRpcProvider(chainObj.rpcUrl);
      const privateKey = ethers.Wallet.fromPhrase(seedphrase).privateKey;
      let wallet = new ethers.Wallet(privateKey, provider);
      const tx = { to: recipientAddress, value: ethers.parseEther(amount.toString()) };
      const transaction = await wallet.sendTransaction(tx);
      setHash(transaction.hash); // 🟢 Set transaction hash
      await transaction.wait();
      setIsAuthError(true);
      setSendLoader(false);
      setAuthInfo(`Successfully sent ${amount} of ${name} to ${recipientAddress}`);

      const res = await dispatch(sendtansaction(recipientAddress, name, amount, chain, balance, user));
      if (!res.bool) {
        setSendLoader(false);
        setIsAuthError(true);
        return setAuthInfo(`${res.message}`);
      }
    } catch (err) {
      setHash(null);
      setIsAuthError(true);
      setSendLoader(false);
      setAuthInfo(`Transaction failed: ${err.message}`);
    }
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
          <BackHeader
            navigateHandler={navigateHandler}
            openBuyModalFun={openBuyModalFun}
            openSendModalFun={openSendModalFun}
            title='Send Asset'
          />

          <div className={styles.dashboardContent}>
            <div className={styles.dashboardContentleft}>
              <div className={styles.balanceSection}>
                <div className={styles.balanceCard}>
                  <p className={styles.amount}>{balance}{symbol}</p>
                  <p className={styles.amounttext}>Your wallet balance</p>
                </div>
              </div>

              <div className={styles.sendBox}>
                <label className={styles.label}>Recipient Address</label>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Enter wallet address"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                />

                <label className={styles.label}>Asset</label>
                <select className={styles.inputField}>
                  <option value="ethereum">{name}</option>
                </select>

                <label className={styles.label}>Amount</label>
                <input
                  type="number"
                  className={styles.inputField}
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                <button className={styles.sendButton} onClick={submitHandler}>
                  {sendLoader ? (
                    <Spinner size={10} color="#fff" className={styles.loader} />
                  ) : (
                    'Continue'
                  )}
                </button>

                {/* ✅ Show transaction hash */}
                {hash && (
                  <div className={styles.hashContainer}>
                    <p className={styles.hashLabel}>Transaction Hash:</p>
                    <p className={styles.hashValue}>{hash}</p>
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

export default Send;




