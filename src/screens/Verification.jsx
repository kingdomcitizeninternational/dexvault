import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verifyEmail } from '../store/action/appStorage';
import AuthModal from '../Modal/AuthModal';
import Spinner from "react-activity/dist/Spinner";
import "react-activity/dist/Spinner.css";
import styles from './Verification.module.css';



const VerificationScreen = () => {
    const [code, setCode] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthError, setIsAuthError] = useState(false);
    const [authInfo, setAuthInfo] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { email } = location.state || {};  // Retrieving the email passed through location state

    const updateAuthError = useCallback(() => {
        setIsAuthError(false);
        setAuthInfo('');
    }, []);

    const handleCodeChange = (e) => {
        const text = e.target.value;
        setCode(text);
        setIsDisabled(text.length !== 4);  // Disable button unless code has 4 digits
    };

    const submitHandler = async () => {
        if (code.length !== 4) return;
        setIsLoading(true);

        const res = await dispatch(verifyEmail({ code, email }));

        if (!res.bool) {
            setIsLoading(false);
            setIsAuthError(true);
            setAuthInfo(res.message);
            return;
        }

        setIsLoading(false);
        navigate('/passcode',{ state: { email } }); // Navigate to next page
        
    };

    return (
        <>
            {isAuthError && <AuthModal modalVisible={isAuthError} updateVisibility={updateAuthError} message={authInfo} />}
            <div className={styles.container}>
                <div className={styles.innerContainer}>
                    <div className={styles.progress}>
                        <div className={styles.progressbar}>
                            <div className={styles.progressBarFilled} style={{ width: '100%' }}></div>
                        </div>
                        <div className={styles.progressbar}>
                            <div className={styles.progressBarFilled} style={{ width: '50%' }}></div>
                        </div>
                        <div className={styles.progressbar}>
                            <div className={styles.progressBarFilled} style={{ width: '0%' }}></div>
                        </div>
                        <div className={styles.progressbar}>
                            <div className={styles.progressBarFilled} style={{ width: '0%' }}></div>
                        </div>
                    </div>

                    <h1 className={styles.title}>Verify Your Email</h1>
                    <h2 className={styles.subtitle}>Enter the 4-digit code</h2>
                    <p className={styles.description}>
                        A 4-digit verification code has been sent to{' '}
                        <span className={styles.boldText}>{email}</span>. Please enter it below.
                    </p>

                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Enter 4-digit code"
                        value={code}
                        onChange={handleCodeChange}
                        maxLength="4"
                    />

                    <button
                        className={`${styles.button} ${isDisabled ? styles.disabledButton : ''}`}
                        disabled={isDisabled}
                        onClick={submitHandler}
                    >
                        {isLoading ? (
                            <Spinner size={10} className={styles.loader} style={{ color: 'rgb(52, 134, 52)' }} />
                        ) : (
                            'Verify'
                        )}
                    </button>
                </div>

            </div>

        </>
    );
};

export default VerificationScreen;
