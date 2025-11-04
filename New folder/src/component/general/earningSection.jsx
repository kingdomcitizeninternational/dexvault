import React, { useEffect } from 'react';
import styles from './earningSection.module.css'
import AOS from 'aos'
import "aos/dist/aos.css";

function EarningSection({ navigateToApp }) {
    useEffect(() => {
        AOS.init({
            duration: 1000
        });
    })

    return (<div className={styles.earning_section} data-aos="fade-up"  >

        <div className={styles.earning_content}>
            <div className={styles.earning_innercontent}>
                <h1>Earn up to $16 worth of crypto</h1>
                <p>Discover how specific cryptocurrencies work — and get a bit of each crypto to try out for yourself.</p>

                <button onClick={navigateToApp}>Start earning</button>

            </div>

        </div>
        <div className={styles.image_container}>
            <img src="../../coinbase_image2.png" />

        </div>


    </div>
    );
}

export default EarningSection;