import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaSpinner } from 'react-icons/fa';  // For the spinner icon
import styles from  './OnscreenModal.module.css';  // For additional styling





const OnscreenModal = () => {
  const [isOpen, setIsOpen] = useState(true); // Controls modal visibility
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}  // Close modal on background click
      ariaHideApp={false}  // For accessibility, you may want to set this
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background for modal
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000, // Ensure it's above everything
        },
        content: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          backgroundColor: 'transparent', // Transparent content area
          padding: 0,
        },
      }}
    >
      <div className={styles.spinnercontainer}>
        <FaSpinner className={styles.spinner} color='#4f46e5' />
      </div>
    </Modal>
  );
};

export default OnscreenModal;
