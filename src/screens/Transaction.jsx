import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Transaction.module.css';
import BuyModal from '../Modal/BuyModal';
import SendModal from '../Modal/SendModal';
import DesktopSideBar from '../components/DesktopSideBar';
import BackHeader from '../components/BackHeader';
import { useSelector } from 'react-redux';
import { formatDate } from '../utils/utils';
import AuthModal from '../Modal/AuthModal';
import { idbGet,idbRemove,idbSet } from '../store/action/appStorage';



const Settings = () => {
  const [openBuyModal, setOpenBuyModal] = useState(false);
  const [openSendModal, setOpenSendModal] = useState(false);
  const { transactions } = useSelector(state => state.userAuth);

  const [isAuthError, setIsAuthError] = useState(false);
  const [authInfo, setAuthInfo] = useState("");
  let { user, seedphrase, chain, network, address } = useSelector(state => state.userAuth)


  const updateAuthError = () => {
    setIsAuthError(prev => !prev);
    setAuthInfo('')
  }




  const navigate = useNavigate();
  const openBuyModalFun = () => setOpenBuyModal(true);
  const openSendModalFun = () => setOpenSendModal(true);
  const buyFunction = () => setOpenBuyModal(false);
  const sellFunction = () => setOpenBuyModal(false);
  const sendFunction = () => setOpenSendModal(false);
  const receiveFunction = () => setOpenSendModal(false);
  const navigateHandler = () => navigate(-1);



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
          {/* ✅ Use BackHeader here */}
          <BackHeader
            navigateHandler={navigateHandler}
            openBuyModalFun={openBuyModalFun}
            openSendModalFun={openSendModalFun}
            title='Transactions'
          />

          <div className={styles.dashboardContent}>
            <div className={styles.dashboardContentleft}>


              <div className={styles.transactionsContainer}>

                {transactions.length > 0 ? (
                  <ul className={styles.transactionList}>
                    {transactions.map((tx, index) => (
                      <li key={index} className={styles.transactionCard}>
                        <div className={styles.txDetails}>
                          <span className={styles.txType}>{tx.currency}</span>
                          <span className={styles.txDate}>{formatDate(tx.date)}</span>
                        </div>
                        <span
                          className={`${styles.txAmount} ${tx.amount.startsWith('-') ? styles.sent : styles.received
                            }`}
                        >
                          {tx.amount}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={styles.noTransactionBox}>

                    <p className={styles.noTxText}>No transactions yet</p>

                  </div>
                )}

              </div>






            </div>
            <div className={styles.dashboardContentright}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;