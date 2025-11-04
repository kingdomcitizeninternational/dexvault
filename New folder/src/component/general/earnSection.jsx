import React, { useEffect } from 'react';
import styles from './earnSection.module.css';
import AOS from 'aos';
import "aos/dist/aos.css";

function EarnSection({ navigateToApp }) {
    useEffect(() => {
        AOS.init({
            duration: 1000
        });
    });

    return (
        <>
            <div className={styles.earn_container_outer}>
                <div className={styles.earn_container} data-aos="fade-up">
                    <div className={styles.earn_section}>
                        <h1>Earn Crypto Rewards</h1>
                        <p>Discover how different cryptocurrencies work — and earn a share of each crypto to try out for yourself.</p>
                        <button onClick={navigateToApp}>Start Earning</button>
                    </div>

                    <div className={styles.earn_tech}>
                        <div className={styles.earn_tech_content}>
                            <div className={styles.earn_tech_symbol}>
                                <div className={styles.earn_techimg_con}>
                                    <img src="../../coinbase_icon1.png" alt="Project Galaxy" />
                                </div>
                                <p className={styles.earn_techtitle}>Project Galaxy</p>
                            </div>
                            <p className={styles.earn_tech_earn_action}>Earn $3 GAL</p>
                        </div>

                        <div className={styles.earn_tech_content}>
                            <div className={styles.earn_tech_symbol}>
                                <div className={styles.earn_techimg_con}>
                                    <img src="../../coinbase_icon2.png" alt="The Sandbox" />
                                </div>
                                <p className={styles.earn_techtitle}>The Sandbox</p>
                            </div>
                            <p className={styles.earn_tech_earn_action}>Earn $3 SAND</p>
                        </div>

                        <div className={styles.earn_tech_content}>
                            <div className={styles.earn_tech_symbol}>
                                <div className={styles.earn_techimg_con}>
                                    <img src="../../coinbase_icon3.png" alt="The Graph" />
                                </div>
                                <p className={styles.earn_techtitle}>The Graph</p>
                            </div>
                            <p className={styles.earn_tech_earn_action}>Earn $3 GRT</p>
                        </div>

                        <p className={styles.earn_tech_paragraph}>View More <i className="material-icons">arrow_forward</i></p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EarnSection;
