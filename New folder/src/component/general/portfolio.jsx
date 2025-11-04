import React, { useEffect } from 'react';

import styles from './portfolio.module.css'
import SectionHead from './SectionHead'
import AOS from 'aos'
import "aos/dist/aos.css";


function Portfolio() {
    useEffect(()=>{
        AOS.init({
            duration:1000
        });
    })



    return (<>
        <div className={styles.portfolio_section} >

            <SectionHead title="Create your portfolio today" paragraph="dexvault has a variety of features that make it the best place to start trading" />

            <div className={styles.portfolio_container}>
                <div className={styles.portfolio_contentCon}>
                    <div className={styles.portfolio_content}>

                        <div className={styles.portfolio_content_logo} data-aos="fade-up">
                            <div className={styles.portfolio_content_logo_con}>
                                <img src="../../coinbase_check.jpg" />

                            </div>

                        </div>

                        <div className={styles.portfolio_content_writeup} data-aos="fade-up">
                            <h1>Manage your portfolio</h1>
                            <p>Buy and sell popular digital currencies, keep track of them in the one place.</p>

                        </div>


                    </div>
                    <div className={styles.portfolio_content} data-aos="fade-up">
                        <div className={styles.portfolio_content_logo}>
                            <div className={styles.portfolio_content_logo_con}>
                                <img src="../../explore.jpg" />

                            </div>



                        </div>

                        <div className={styles.portfolio_content_writeup}>
                            <h1>Recurring buys</h1>
                            <p>Invest in cryptocurrency slowly over time by scheduling buys daily, weekly, or monthly.</p>

                        </div>


                    </div>




                    <div className={styles.portfolio_content} data-aos="fade-up">
                        <div className={styles.portfolio_content_logo}>
                            <div className={styles.portfolio_content_logo_con}>
                                <img src="../../coinbase_secure2.png" />

                            </div>



                        </div>

                        <div className={styles.portfolio_content_writeup}>
                            <h1>Vault protection</h1>
                            <p>For added security, store your funds in a vault with time delayed withdrawals.</p>

                        </div>


                    </div>



                    <div className={styles.portfolio_content} data-aos="fade-up">
                        <div className={styles.portfolio_content_logo}>
                            <div className={styles.portfolio_content_logo_con}>
                                <img src="../../coinbase_check.jpg" />

                            </div>



                        </div>

                        <div className={styles.portfolio_content_writeup}>
                            <h1>Mobile apps</h1>
                            <p>Stay on top of the markets with the dexvault app for Android or iOS.</p>

                        </div>


                    </div>





                </div>


                <div className={styles.portfolio_imageCon} data-aos="fade-up">
                    <img src='../../homedesktop.jpeg' />

                </div>



            </div>


        </div>
    </>

    );
}

export default Portfolio;