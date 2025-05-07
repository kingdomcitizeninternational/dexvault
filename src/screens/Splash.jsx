import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './splash.module.css'; // Assuming you have a separate file for the styles
import { checkIfIsLoggedIn } from '../store/action/appStorage';

const Splash = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const visibilityHandler = () => {
    setModalVisible(false);
  };

  useEffect(() => {
  setTimeout(()=>{
    fetchData();
  },5000)
 
  }, []);

  const fetchData = async () => {
    navigate('/onboarding')
    // Replace with your actual logic for checking if the user is logged in
    let res = await checkIfIsLoggedIn();
    if (!res.bool) {
      return navigate('/onboarding');
    }
    return navigate('/onboarding');
  };

  return (
    <>
      <div className={styles.screen}>
        <div className={`${styles.container}`}>
          {/* Replace Text with Image */}
          <img
            src={'../../icons8-wallet-32.png'} // Ensure the path is correct
            alt="Wallet Icon"
            className={styles.image}
          />
        </div>
      </div>
    </>
  );
};

export default Splash;



