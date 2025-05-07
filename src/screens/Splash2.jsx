import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated for React Router v6
import styles from './Splash2.module.css'; // Import styles from CSS Modules

const Splash = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate(); // Use 'useNavigate' instead of 'useHistory'

  const visibilityHandler = () => {
    setModalVisible(false);
  };

  return (
    <div className={styles.screen}>
      <div className={`${styles.container} ${modalVisible ? styles.dim : ''}`}>
        {/* Icon Image */}
        <img
          src={'./icons8-wallet-32.png'} // Ensure the path is correct
          alt="Wallet Icon"
          className={styles.image}
        />

        {/* Welcome Text */}
        <h1 className={styles.welcomeText}>Welcome to DexVault</h1>

        {/* Continue Button */}
        <button
          className={styles.continueButton}
          onClick={() => navigate('/login')} // Use 'login' page route in React Router
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Splash;


