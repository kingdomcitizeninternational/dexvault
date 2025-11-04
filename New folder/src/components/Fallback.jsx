import React from 'react';
import styles from './Fallback.module.css'; // Adjust path if needed

const Splash = () => {
  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        <img
          src={'../../icons8-wallet-32.png'} // Make sure the image path is correct
          alt="Wallet Icon"
          className={styles.image}
        />
      </div>
    </div>
  );
};

export default Splash;

