import React, { useState, useEffect } from 'react';
import styles from './getStarted.module.css';
import LoadingModal from "./LoadingModal";
import Modal from "./Modal";
import AOS from 'aos';
import "aos/dist/aos.css";

function GetStarted({ navigateToApp }) {

    const [isError, setIsError] = useState(false);
    const [isErrorInfo, setIsErrorInfo] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const closeModal = () => {
        setIsError(false);
    };

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    return (
        <>
            {isError && <Modal showModal={isError} closeModal={closeModal} content={isErrorInfo} />}
            {isLoading && <LoadingModal />}

            <div className={styles.getStartedSectionOuter} data-aos="fade-up">
                <div className={styles.getStartedSection}>
                    <div className={styles.getStartedSection_content}>
                        <div className={styles.getStartedSection_content_paragraph}>
                            <i className='material-icons bitcoin_icon'>currency_bitcoin</i>
                            <h3>Jump start your portfolio</h3>
                            <i className='material-icons'>arrow_forward</i>
                        </div>

                        <h1 className={styles.getStartedSection_content_head}>Jump start your crypto portfolio</h1>
                        <p className={styles.getStartedSection_content_about}>
                            dexvault is the easiest place to buy and sell cryptocurrency. Sign up and get started today.
                        </p>

                        <div className={styles.getStartedSection_content_form}>
                            <input type="email" placeholder='Email address' />
                            <button onClick={navigateToApp}>Get Started</button>
                        </div>
                    </div>

                    <div className={styles.getStartedSection_imageCon}>
                        <img src='../../homeapp.jpeg' alt="crypto app" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default GetStarted;
