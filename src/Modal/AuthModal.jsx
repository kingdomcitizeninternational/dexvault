import React from "react";
import styles from "./AuthModal.module.css";

const AuthModal = ({ modalVisible, updateVisibility, message }) => {
  if (!modalVisible) return null;

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalView}>
        <p className={styles.modalState}>{message}</p>
        <div className={styles.modalButtonContainer}>
          <button className={styles.acceptBtn} onClick={updateVisibility}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
