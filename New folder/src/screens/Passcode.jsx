import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFingerprint, faBackspace } from '@fortawesome/free-solid-svg-icons';
import styles from './Passcode.module.css';




export default function PasscodeScreen() {
    const [passcode, setPasscode] = useState("");
    const [isFingerprintEnabled, setIsFingerprintEnabled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation()
    const { email } = location.state || {};  // Retrieving the email passed through location state


    const handleKeyPress = (num) => {
        if (passcode.length < 4) {
            const newPasscode = passcode + num;
            setPasscode(newPasscode);

            // Check if all 4 digits are entered and navigate to next screen
            if (newPasscode.length === 4) {
                navigate('/confirm-passcode', {
                    state: { code: newPasscode,email:email }

                });
            }
        }
    };

    const handleDelete = () => {
        setPasscode(passcode.slice(0, -1));
    };

    const navigateHandler=()=>{
        navigate(-1);

    }

    return (
        <div className={styles.container}>
            <div className={styles.innerContainer}>
                <div  className={styles.headerContainer}>
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
                            <div className={styles.progressBarFilled} style={{ width: '50%' }}></div>
                        </div>
                        <div className={styles.progressbar}>
                            <div className={styles.progressBarFilled} style={{ width: '0%' }}></div>
                        </div>
                    </div>

                </div>


                <h1 className={styles.title}>Create passcode</h1>
                <p className={styles.description}>This will protect your wallet on your device.</p>

                <div className={styles.passcodeContainer}>
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className={styles.passcodeBox}>
                            {passcode[index] ? "*" : ""}
                        </div>
                    ))}
                </div>

                <div className={styles.fingerprintContainer}>
                    <FontAwesomeIcon icon={faFingerprint} size="lg" />
                    <p className={styles.fingerprintText}>Enable Fingerprint to log in</p>
                    <label className={styles.switch}>
                        
                        <input
                            type="checkbox"
                            checked={isFingerprintEnabled}
                            onChange={() => setIsFingerprintEnabled(!isFingerprintEnabled)}
                        />

                        <span className={styles.slider}></span>
                    </label>
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
    );
}
