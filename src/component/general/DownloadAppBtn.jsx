import React from 'react';
import styles from './DownloadAppBtn.module.css';

export const DownloadAppBtn = ({appUrl,platform,iconName}) => {
    return (

        <button className={styles.getStartedSection_imageCon_button}>
            <a href={`${appUrl}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className={styles.buttonText}> Download on {platform} </span>

                <i className='material-icons' style={{ color: 'grey', fontSize: 35 }}>{iconName}</i>
            </a>

        </button>
    )
}
