import React, { useState } from 'react';
import styles from './learnCard.module.css'


function LearnCard(props) {
    return ( <div className={styles.card} onClick={props.onPress} >
        <img src={props.url} />
        <p>{props.paragraph}</p>
        <h1 >{props.firstParagraph}</h1>
        <h3>{props.secondHeading}</h3>

    </div>);
}

export default LearnCard;