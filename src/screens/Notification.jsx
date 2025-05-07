import React, { useEffect, useState } from 'react';
import styles from './Notification.module.css';
import { useNavigate } from 'react-router-dom';

function PushNotificationsScreen() {
  const [scale, setScale] = useState(0);
  const navigate = useNavigate();

  const navigateHandler = () => {
    navigate('/wallet');
  };

  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      frame += 1;
      setScale(Math.min(frame * 0.05, 1));
      if (frame * 0.05 >= 1) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h1 className={styles.title}>Push Notifications</h1>
        <p className={styles.subtitle}>
          Get notified about your wallet activity and customer support messages.
        </p>
        <img
          src={'../../notification.png'}
          alt="Notification"
          className={styles.image}
        />
        <div
          className={styles.button}
          style={{ transform: `scale(${scale})` }}
        >
          <button className={styles.buttonContent} onClick={navigateHandler}>
            <span className={styles.buttonText}>Allow Notifications</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PushNotificationsScreen;
