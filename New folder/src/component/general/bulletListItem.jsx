import React, { useState, useEffect } from 'react';

import styles from './bulletListItem.module.css'


function BulletListItem({text}) {
    return  <div className={styles.bulletlist_con}>
    <div>
        <div className={styles.bullet}>

        </div>

    </div>

    <p className={styles.paragraph}>
        {text}
    </p>

</div>

}

export default BulletListItem;