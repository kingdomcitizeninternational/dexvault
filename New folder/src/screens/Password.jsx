import React, { useState, useCallback,useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBackspace } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import styles from './Passcode.module.css';
import { checkPasscode, fetchPasscode } from "../store/action/appStorage";
import OnscreenModal from "../Modal/OnscreenModal";
import AuthModal from '../Modal/AuthModal';
import { useDispatch } from "react-redux";


export default function PasscodeScreen() {
    const [passcode, setPasscode] = useState("");
    const [isAuthError, setIsAuthError] = useState(false);
    const [authInfo, setAuthInfo] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation()
    const dispatch = useDispatch()

    const {
        email
    } = location.state



    const handleKeyPress = async (num) => {
        if (passcode.length < 4) {
            const newPasscode = passcode + num;
            setPasscode(newPasscode);

            if (newPasscode.length === 4) {
                setIsLoading(true);

                const res = await dispatch(checkPasscode({
                    code: newPasscode,
                    email,
                }));

                setIsLoading(false);

                if (!res.bool) {
                    setPasscode(""); // 👈 Reset input on error
                    setIsAuthError(true);
                    setAuthInfo(res.message);
                    return;
                }

                navigate(`/${res.url}`);
            }
        }
    };


    const handleDelete = () => {
        setPasscode(passcode.slice(0, -1));
    };

    const navigateHandler = () => {
        navigate(-1);

    }

    const updateAuthError = useCallback(() => {
        setIsAuthError(prev => !prev);
        setAuthInfo('');
    }, []);




    const fpassHandler = async () => {
        if (!email) {
            setIsAuthError(true)
            setAuthInfo('Invalid email provided!')
            return
        }
        setIsLoading(true)
        //call api to send passcode as an email to the client

        let res = await dispatch(fetchPasscode({ email: email }))
        setIsLoading(false)
        if (!res.bool) {
            setIsAuthError(true)
            setAuthInfo(res.message)
            return
        }
        setIsAuthError(true)
        setAuthInfo(res.message)
    }




    // Inside PasscodeScreen component
    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key;

            if (!isLoading && !isAuthError) {
                if (/^\d$/.test(key)) {
                    handleKeyPress(key);
                } else if (key === "Backspace") {
                    handleDelete();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [passcode, isLoading, isAuthError]); // Make sure this updates when needed






    return (
        <>
            {isLoading && <OnscreenModal />}
            {isAuthError && <AuthModal modalVisible={isAuthError} updateVisibility={updateAuthError} message={authInfo} />}

            <div className={styles.container}>
                <div className={styles.innerContainer}>
                    <div className={styles.headerContainer}>
                        {/* Replace GenIcon with FontAwesomeIcon */}
                        <FontAwesomeIcon icon={faArrowLeft} size="lg" className={styles.backIcon} onClick={navigateHandler} />

                        <div className={styles.progress}>
                            <div className={styles.progressbar}>
                                <div className={styles.progressBarFilled} style={{ width: '100%' }}></div>
                            </div>
                            <div className={styles.progressbar}>
                                <div className={styles.progressBarFilled} style={{ width: '100%' }}></div>
                            </div>
                            <div className={styles.progressbar}>
                                <div className={styles.progressBarFilled} style={{ width: '100%' }}></div>
                            </div>
                            <div className={styles.progressbar}>
                                <div className={styles.progressBarFilled} style={{ width: '0%' }}></div>
                            </div>
                        </div>

                    </div>


                    <h1 className={styles.title}>Enter passcode</h1>
                    <p className={styles.description}>This will protect your wallet on your device.</p>

                    <div className={styles.passcodeContainer}>
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className={styles.passcodeBox}>
                                {passcode[index] ? "*" : ""}
                            </div>
                        ))}
                    </div>

                    <div className={styles.fingerprintContainer}>


                        <FontAwesomeIcon icon={faLock} size="lg" />


                        <p className={styles.fingerprintText}>Forget passcode?? <span className={styles.linkUrl} onClick={fpassHandler} style={{ color: '#4F46E5' }}>click here</span></p>

                    </div>

                    <div className={styles.keypad}>
                        {[...Array(9)].map((_, index) => (
                            <button
                                key={index}
                                className={styles.key}
                                onClick={() => handleKeyPress((index + 1).toString())}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button className={styles.key} onClick={handleDelete}>
                            <FontAwesomeIcon icon={faBackspace} size="lg" />
                        </button>
                        <button className={styles.key} onClick={() => handleKeyPress("0")}>
                            0
                        </button>
                    </div>
                </div>
            </div>

        </>



    );
}
