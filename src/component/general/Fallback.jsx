import React  from 'react';
import styles from './Fallback.module.css';
import Spinner from "react-activity/dist/Spinner"
import "react-activity/dist/Spinner.css";
import { useSelector } from "react-redux";

function FallBackComponent() {
  let { user,color } = useSelector(state => state.userAuth)

    return (<div className={styles.fallbackComponent} style={{backgroundColor:user?color.background:''}}>
    <Spinner size={30} color="#1652f0" />
  </div>
    )
}

export default FallBackComponent;