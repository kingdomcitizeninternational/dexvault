import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authenticate } from '../store/action/appStorage';
import './Login.css'; // regular CSS
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
            <div className="container">
                <div className="innerContainer">
                    <div className="progress">
                        {[100, 50, 0, 0].map((val, i) => (
                            <div className="progressbar" key={i}>
                                <div className="progressBarFilled" style={{ width: `${val}%` }}></div>
                            </div>
                        ))}
                    </div>
                    <h2 className="title">Log in or Create</h2>
                    <h3 className="subtitle">Account</h3>
                    <p className="description">Choose the method to create an account or log in to Dexvault.</p>

                    <input
                        type="email"
                        className="input"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <p className="error">{isEmailValid}</p>

                    <button
                        className={`button ${isDisabled ? 'disabledButton' : ''}`}
                        disabled={isDisabled}
                        onClick={submitHandler}
                    >
                        {isLoading ? (
                            <Spinner
                                size={10}
                                color="#fff"
                                className="loader"
                                style={{ color: '#fff', fill: '#fff', stroke: '#fff' }}
                            />
                        ) : 'Continue'}
                    </button>

                    <div className="termsText">
                        By using the Dexvault app, I agree to the <span className="link">Terms of Service</span> and
                        <span className="link"> Privacy Policy</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginScreen;


