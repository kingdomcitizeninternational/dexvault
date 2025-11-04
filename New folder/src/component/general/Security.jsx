import React, { useEffect } from 'react';
import styles from './Security.module.css';
import SectionHead from './SectionHead';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Security() {
    useEffect(() => {
        AOS.init({
            duration: 1000,
        });
    });

    return (
        <div className={styles.security_section}>
            <SectionHead 
                title="The Most Secure Crypto Wallet" 
                paragraph="Here are a few reasons why you should choose our wallet to safeguard your digital assets"
            />
            <div className={styles.security_Con}>
                <div className={styles.security_card} data-aos="fade-up">
                    <div className={styles.security_imageCon}>
                        <span className="material-icons">lock</span>
                    </div>
                    <div className={styles.security_content}>
                        <h1>Unbreakable Encryption</h1>
                        <p>Our wallet uses the latest encryption technologies to ensure that your private keys are always safe and secure.</p>
                        <a href="#">Learn how our encryption keeps your assets safe <span className="material-icons">arrow_forward</span></a>
                    </div>
                </div>

                <div className={styles.security_card} data-aos="fade-up">
    <div className={styles.security_imageCon}>
        <span className="material-icons" style={{ fontSize: '4rem', color: '#1652f0' }}>
            vpn_key
        </span>
    </div>
    <div className={styles.security_content}>
        <h1>Multi-Signature Security</h1>
        <p>We offer multi-signature support, ensuring that no transaction can occur without your explicit authorization.</p>
        <a href="#">Learn how our multi-signature works to protect your funds <span className="material-icons">arrow_forward</span></a>
    </div>
</div>


                <div className={styles.security_card} data-aos="fade-up">
                    <div className={styles.security_imageCon}>
                        <span className="material-icons">shield</span>
                    </div>
                    <div className={styles.security_content}>
                        <h1>Secure Backups</h1>
                        <p>Your wallet and assets are backed up, ensuring that even in the event of a device failure, your funds are fully recoverable.</p>
                        <a href="#">Learn how we help you back up and recover your wallet securely <span className="material-icons">arrow_forward</span></a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Security;

