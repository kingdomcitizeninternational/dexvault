import React, { useState } from "react";
import styles from "./Network.module.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";




const ProfileModal = ({ hideModal, propertyName, propertyValue }) => {
  const [isAuthError, setIsAuthError] = useState(false);
  const [authInfo, setAuthInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();



  const closeHandler = () => {
    hideModal();
  };

  const editHandler = () => {
    navigate('/registeration')
  }


  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalView}>
        <span className="material-icons" style={{ width: "100%", textAlign: "start", cursor: "pointer" }} onClick={closeHandler}>
          close
        </span>
        <div className={styles.optionList} style={{ gap: '0px', alignItems: 'start', padding: '3px' }}>
          <span >{propertyName}</span>
          <p style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>{propertyValue}</p>

        </div>

        <div className={styles.modalButtonContainer}>
          <button className={styles.acceptBtn} onClick={editHandler} disabled={isLoading}>
            Edit
          </button>
          {isAuthError && <p style={{ color: "red" }}>{authInfo}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;