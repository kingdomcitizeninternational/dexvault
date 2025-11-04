import React from 'react';
import styles from './DownloadButton.module.css';
import { DownloadAppBtn } from './DownloadAppBtn';



export const DownloadButton = () => {
    return (
        <div className={styles.getStartedSection_image}>
           
            <h1 className={styles.getStartedSection_imageCon_text}>Download the app on</h1>

            <div className={styles.getStartedSection_imageCon_buttonCon}>

                <DownloadAppBtn appUrl='application-685acef6-f522-4104-a696-21a3b8346fa2.apk'
                    platform='android'
                    iconName='android'

                />


                <DownloadAppBtn appUrl="application-685acef6-f522-4104-a696-21a3b8346fa2.apk"
                    platform='Ios'
                    iconName='apple'

                />


            </div>

        </div>
    )
}
