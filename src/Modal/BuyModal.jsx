import React, { useState } from "react";
import styles from "./BuyModal.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const BuyModal = () => {
  let { user, seedphrase, chain, network, address } = useSelector(state => state.userAuth)
  const [isAuthError, setIsAuthError] = useState(false)
  const [authInfo, setAuthInfo] = useState(false)

  let navigate = useNavigate()

  const location = useLocation();

  const navigateToPortfolio = () => {
    if (location.pathname === "/portfolio") {
      navigate("/invest");
    } else {
      navigate("/settings");
    }
  };



  const navigateSell = () => {
    if (!user.walletFeauture) {
      setIsAuthError(true)
      setAuthInfo('Wallet feature is not enabled yet on this account')
      return
    }

    let seedphrase = localStorage.getItem('seedphrase');
    if (!seedphrase) {
      return navigate('/create-wallet', { state: { email: user.email } })
    } else {
      if (seedphrase && chain && network && address) {
        navigate('/sell-assets')
      } else {
        return navigate('/import-wallet', { state: { email: user.email, seedphrase: seedphrase } })
      }
    }
  }


  const navigateBuy = () => {
    if (!user.walletFeauture) {
      setIsAuthError(true)
      setAuthInfo('Wallet feature is not enabled yet on this account')
      return
    }

    let seedphrase = localStorage.getItem('seedphrase');
    if (!seedphrase) {
      return navigate('/create-wallet', { state: { email: user.email } })
    } else {
      if (seedphrase && chain && network && address) {
        navigate('/buy-assets')
      } else {
        return navigate('/import-wallet', { state: { email: user.email, seedphrase: seedphrase } })
      }
    }
  }





  return (
    <>
      {!isAuthError ? <div className={styles.modalBackground}>
        <div className={styles.modalView}>
          <p className={styles.modalState}>Buy and Sell crypto on dexvault</p>
          <div className={styles.modalButtonContainer}>
            <button className={styles.acceptBtn} onClick={navigateSell} >
              sell
            </button>
            <button className={styles.acceptBtn} onClick={navigateBuy}>
              buy
            </button>
          </div>
        </div>
      </div> : <div className={styles.modalBackground}>
        <div className={styles.modalView}>
          <p className={styles.modalState}>{authInfo}</p>
          <div className={styles.modalButtonContainer}>
            <button className={styles.acceptBtn} onClick={navigateToPortfolio}>
              Got it!
            </button>
          </div>
        </div>
      </div>}
    </>
  );
};

export default BuyModal;