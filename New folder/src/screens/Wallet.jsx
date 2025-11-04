import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styles from './Login.module.css';
import "react-activity/dist/Spinner.css";
import { useNavigate, useLocation } from "react-router-dom";



const WalletScreen = () => {
    const location = useLocation()
    const {  email,seedphrase } = location.state || {};

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleImportWallet = () => {
        navigate('/import-wallet',{state:{email:email,seedphrase:seedphrase}});
    };

    const handleCreateWallet = () => {
        navigate('/create-wallet',{state:{email}});
    };

    return (
        <div className={styles.container}>
            <div className={styles.innerContainer}>
                <h2 className={styles.title}>Import or Create</h2>
                <p className={styles.description}>
                    Choose a method to either log in to your existing wallet or create a new one.
                </p>

                <div className={styles.buttonContainer}>


                    <button
                        className={`${styles.walletButton} ${styles.createButton}`}
                        onClick={handleCreateWallet}
                    >
                        <span className={styles.buttonText} style={{color:'#ffff'}}>Create Wallet</span>
                    </button>

                    <button
                        className={`${styles.walletButton} ${styles.importButton}`}
                        onClick={handleImportWallet}
                    >
                        <span className={styles.buttonText}>Import Wallet</span>
                    </button>
                </div>

                <div className={styles.securityMessage}>
                    <p>Your private keys are securely stored and never shared.</p>
                </div>
            </div>
        </div>
    );
};

export default WalletScreen;
