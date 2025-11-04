import React, { useEffect} from 'react';
import styles from './SectionHead.module.css'
import AOS from 'aos'
import "aos/dist/aos.css";


function SectionHead({title,paragraph}) {
    useEffect(()=>{
        AOS.init({
            duration:1000
        });
    })

    return (<div className={styles.sectionhead_section} data-aos="fade-up" >
            <h1>{title}</h1>
            <p>{paragraph}</p>

        </div>

    );
}

export default SectionHead;