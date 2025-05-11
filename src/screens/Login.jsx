import React, { useState } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authenticate } from '../store/action/appStorage';
import styles from './Login.module.css';
import AuthModal from '../Modal/AuthModal';
import Spinner from "react-activity/dist/Spinner";
import "react-activity/dist/Spinner.css";

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);
    const [isAuthError, setIsAuthError] = useState(false);
    const [authInfo, setAuthInfo] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const updateAuthError = () => {
        setIsAuthError(prev => !prev);
        setAuthInfo('');
    };

    const handleEmailChange = (e) => {
        const text = e.target.value;
        setEmail(text);
        setIsDisabled(text.trim() === '');
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const submitHandler = async () => {
        if (isLoading) return;
        if (!email || !isValidEmail(email)) {
            setIsEmailValid('Enter a valid email');
            return;
        }

        localStorage.setItem('email', email);
        setIsEmailValid('');
        setIsLoading(true);
        setProgress(0.2);

        const res = await dispatch(authenticate({ email }));

        if (!res.bool) {
            setIsLoading(false);
            setIsAuthError(true);
            setAuthInfo(res.message);
            setProgress(0);
            return;
        }
        setIsLoading(false);
        navigate(`/${res.url}`, { state: { email } });
    };

    return (
        <>
            {isAuthError && <AuthModal modalVisible={isAuthError} updateVisibility={updateAuthError} message={authInfo} />}
            <div className={styles.container}>
                <div className={styles.innerContainer}>
                    <div className={styles.progress}>
                        {[100, 50, 0, 0].map((val, i) => (
                            <div className={styles.progressbar} key={i}>
                                <div className={styles.progressBarFilled} style={{ width: `${val}%` }}></div>
                            </div>
                        ))}
                    </div>
                    <h2 className={styles.title}>Log in or Create</h2>
                    <h3 className={styles.subtitle}>Account</h3>
                    <p className={styles.description}>Choose the method to create an account or log in to Dexvault.</p>

                    <input
                        type="email"
                        className={styles.input}
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <p className={styles.error}>{isEmailValid}</p>

                    <button
                        className={`${styles.button} ${isDisabled ? styles.disabledButton : ''}`}
                        disabled={isDisabled}
                        onClick={submitHandler}
                    >
                        {isLoading ? (
                            <Spinner
                                size={10}
                                color="#fff"
                                className={styles.loader}
                                style={{ color: '#fff', fill: '#fff', stroke: '#fff' }}
                            />
                        ) : 'Continue'}
                    </button>

                    <div className={styles.termsText}>
                        By using the Dexvault app, I agree to the <span className={styles.link}>Terms of Service</span> and
                        <span className={styles.link}> Privacy Policy</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginScreen;



