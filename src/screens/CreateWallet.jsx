import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {idbGet, openWallet } from '../store/action/appStorage';
import styles from './CreateWallet.module.css';
import Spinner from "react-activity/dist/Spinner";
import "react-activity/dist/Spinner.css";
import { ethers } from 'ethers';
import AuthModal from '../Modal/AuthModal';
import OnscreenModal from "../Modal/OnscreenModal";





const CreateWalletScreen = () => {
    const [seedPhrase, setSeedPhrase] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthError, setIsAuthError] = useState(false);
    const [authInfo, setAuthInfo] = useState("");
    const [isScreenLoading, setIsScreenLoading] = useState(false);
    const [email,setEmail] = useState('')


    const loadEmailFromStorage =async()=>{
        const retrievedEmail = await idbGet('email')
        setEmail(retrievedEmail)
    }


    useEffect(()=>{
     loadEmailFromStorage()
    },[loadEmailFromStorage])
 



   

    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const generateSeedPhrase = () => {
        // Simulating seed phrase generation. Normally, this would be securely generated
        const newSeedPhrase = ethers.Wallet.createRandom().mnemonic.phrase
        setSeedPhrase(newSeedPhrase);
    }


    // this code generate wallet address
    const handleCreateWallet = async () => {
        if(!email){
            navigate('/login')
            return
        }
        if (seedPhrase.trim().length === 0) {
            setIsLoading(false)
            setIsAuthError(true);
            setAuthInfo('please generate a seed phrase before creating a wallet')
            return;
        }
      

        try {
            // interacting with the blockchain to create address
            const address = ethers.Wallet.fromPhrase(seedPhrase).address
          
           //dispatch a method that store seedphrase on the backend server
            let res = await dispatch(openWallet({email,seedPhrase,address}))
         
            if (!res.bool) {
                setIsLoading(false)
                setIsAuthError(true)
                setAuthInfo(res.message)
                return setIsScreenLoading(false)
            }


            //navigate to notification triggering page!!!!
            navigate(`/dashboard`)

        } catch (error) {
            setIsLoading(false);
            setErrorMessage("Failed to create wallet. Please try again.");
        }
    };


    const updateAuthError = () => {
        setIsAuthError(prev => !prev);
        setAuthInfo('')
    }




    return (
        <>
            {isScreenLoading && <OnscreenModal />}

            {isAuthError && <AuthModal modalVisible={isAuthError} updateVisibility={updateAuthError} message={authInfo} />}

          

            <div className={styles.container}>
                <div className={styles.innerContainer}>
                    <h2 className={styles.title}>Create Your Wallet</h2>
                    <p className={styles.description}>Generate a new wallet by creating a seed phrase.</p>

                    <button
                        className={styles.generateButton}
                        onClick={generateSeedPhrase}
                    >
                        {isLoading ? <Spinner size={24} color="#fff" /> : 'Generate Seed Phrase'}
                    </button>

                    {seedPhrase ? (
                        <div className={styles.seedPhraseContainer}>
                            <textarea
                                className={styles.seedPhraseInput}
                                value={seedPhrase}
                                readOnly
                                rows={5}
                            />
                        </div>
                    ) : (
                        <div className={styles.seedWarning}>
                            Once you generate the seed phrase, save it securely in order to recover your wallet in the future!
                        </div>
                    )}

                    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

                    <button
                        className={styles.createButton}
                        onClick={handleCreateWallet}

                    >
                        {isLoading ? <Spinner size={24} color="#fff" /> : 'Create Wallet'}
                    </button>

                    <div className={styles.securityMessage}>
                        <p>Your seed phrase is never stored on our servers. Keep it safe!</p>
                    </div>
                </div>
            </div>
        </>

    );
};

export default CreateWalletScreen;
