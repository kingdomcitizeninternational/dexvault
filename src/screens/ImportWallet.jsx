import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { importSeedPhrase } from '../store/action/appStorage';
import styles from './ImportWallet.module.css';
import "react-activity/dist/Spinner.css";
import { useLocation } from "react-router-dom";
import { ethers } from 'ethers';
import AuthModal from '../Modal/AuthModal';
import OnscreenModal from "../Modal/OnscreenModal";




const ImportWalletScreen = () => {
    const [seedPhrase, setSeedPhrase] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation()
    const [isAuthError, setIsAuthError] = useState(false);
    const [authInfo, setAuthInfo] = useState("");

    const { email, seedphrase } = location.state || {};

    const handleSeedPhraseChange = (e) => {
        setSeedPhrase(e.target.value);
    };

    useEffect(() => {
        if (seedphrase) {
            setSeedPhrase(seedphrase)
        }
    }, [])

    const handleImportWallet = async () => {
        setIsLoading(true)
         if (seedPhrase.trim().length === 0) {
             setIsAuthError(true)
             setAuthInfo(res.message)
             return setIsLoading(false)
         }
         try{
             ethers.Wallet.fromPhrase(seedPhrase).address
 
         }catch(err){
             setIsAuthError(true)
             setAuthInfo(err.message)
             return setIsLoading(false)
             
         }
       
         try {
             const address = ethers.Wallet.fromPhrase(seedPhrase).address
           
 
             let res = await dispatch(importSeedPhrase({email,seedPhrase,address}))
          
             if (!res.bool) {
                 setIsAuthError(true)
                 setAuthInfo(res.message)
                 return setIsLoading(false)
             }
             setIsLoading(false)
             navigate(`/dashboard`)
 
 
 
         } catch (error) {
             setIsLoading(false);
             setIsAuthError(prev => !prev);
             setAuthInfo('')
         }
     };

     const handleCreateWallet = async () => {
        navigate('/create-wallet')
     };

    const updateAuthError = () => {
        setIsAuthError(prev => !prev);
        setAuthInfo('')
    }




    return (
        <>
            {isLoading && <OnscreenModal />}

            {isAuthError && <AuthModal modalVisible={isAuthError} updateVisibility={updateAuthError} message={authInfo} />}


            <div className={styles.container}>
                <div className={styles.innerContainer}>
                    <h2 className={styles.title}>Import Your Wallet</h2>
                    <p className={styles.description}>Enter your 12-word seed phrase to import your wallet.</p>

                    <textarea
                        className={styles.seedPhraseInput}
                        value={seedPhrase}
                        onChange={handleSeedPhraseChange}
                        placeholder="Enter your seed phrase here..."
                        rows={5}
                    />

                 
                    <button
                        className={styles.importButton}
                        onClick={handleImportWallet}
                        disabled={isLoading}
                        style={{marginBottom:'30px'}}
                    >
                        { 'Import Wallet'}
                    </button>

                    <button
                        className={styles.importButton}
                        onClick={handleCreateWallet}
                       
                    >
                        { 'Create New wallet'}
                    </button>

                    <div className={styles.securityMessage}>
                        <p>Your seed phrase is never stored on our servers. Keep it safe!</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ImportWalletScreen;
