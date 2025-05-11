import React, { useState } from "react";
import styles from "./BuyModal.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const SendModal = () => {
  const { user, seedphrase, chain, network, address } = useSelector((state) => state.userAuth);
  const [isAuthError, setIsAuthError] = useState(false);
  const [authInfo, setAuthInfo] = useState("");
  const navigate = useNavigate();

  const location = useLocation();

const navigateToPortfolio = () => {
  if (location.pathname === "/portfolio") {
    navigate("/invest");
  } else if(location.pathname === "/settings") {
    navigate("/portfolio");
  }
};

  const navigateSend = () => {
    if (!user.walletFeauture) {
      setIsAuthError(true);
      setAuthInfo("Wallet feature is not enabled yet on this account");
      return;
    }

    const localSeedphrase = localStorage.getItem("seedphrase");
    if (!localSeedphrase) {
      return navigate("/create-wallet", { state: { email: user.email } });
    } else {
      if (localSeedphrase && chain && network && address) {
        navigate("/send-assets");
      } else {
        return navigate("/import-wallet", { state: { email: user.email, seedphrase: localSeedphrase } });
      }
    }
  };

  const navigateReceive = () => {
    if (!user.walletFeauture) {
      setIsAuthError(true);
      setAuthInfo("Wallet feature is not enabled yet on this account");
      return;
    }

    const localSeedphrase = localStorage.getItem("seedphrase");
    if (!localSeedphrase) {
      return navigate("/create-wallet", { state: { email: user.email } });
    } else {
      if (localSeedphrase && chain && network && address) {
        navigate("/receive");
      } else {
        return navigate("/import-wallet", { state: { email: user.email, seedphrase: localSeedphrase } });
      }
    }
  };

  return (
    <>
      {!isAuthError ? (
        <div className={styles.modalBackground}>
          <div className={styles.modalView}>
            <p className={styles.modalState}>Send and receive crypto on dexvault</p>
            <div className={styles.modalButtonContainer}>
              <button className={styles.acceptBtn} onClick={navigateSend}>
                send
              </button>
              <button className={styles.acceptBtn} onClick={navigateReceive}>
                receive
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.modalBackground}>
          <div className={styles.modalView}>
            <p className={styles.modalState}>{authInfo}</p>
            <div className={styles.modalButtonContainer}>
              <button className={styles.acceptBtn} onClick={navigateToPortfolio}>
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SendModal;
