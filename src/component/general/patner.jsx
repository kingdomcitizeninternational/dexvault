import React, { useEffect } from 'react';

import styles from './patner.module.css'
import SectionHead from './SectionHead'
//import routers
import AOS from 'aos'
import "aos/dist/aos.css";

function Patner() {
    useEffect(() => {
        AOS.init({
            duration: 1000
        });
    })

    return (
        <div className={styles.patnerSection} >
            <div className={styles.sectionhead_section} data-aos="fade-up" >
                <h1>Our patners</h1>
            </div>


            <div className={styles.imageBox}>


                <div className={styles.innerBoxImage}>



                    <div className={styles.imageCard} data-aos="fade-up">
                        <img src={"../../quorom.png"} style={{ width: '60%' }} />

                    </div>

                    <div className={styles.imageCard} data-aos="fade-up">
                        <img src={"../../blockchain2.png"} style={{ width: '100%' }} />

                    </div>
                    

                    <div className={styles.imageCard} data-aos="fade-up">
                        <img src={"../../bitwala_icon.png"} style={{ width: '60%' }} />

                    </div>



                </div>






            </div>

            <div className={styles.imageBox}>


                <div className={styles.innerBoxImage}>



                    <div className={styles.imageCard} data-aos="fade-up">
                        <img src={"../../luno_icon.jpg"} style={{ width: '60%' }} />

                    </div>

                    

                    <div className={styles.imageCard} data-aos="fade-up">
                        <img src={"../../telsa_icon.jpg"} style={{ width: '60%' }} />

                    </div>

                    <div className={styles.imageCard} data-aos="fade-up">
                        <img src={"../../wallmart_icon.jpg"} style={{ width: '60%' }} />

                    </div>



                </div>






            </div>



        </div>

    );
}

export default Patner;