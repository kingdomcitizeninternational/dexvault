// components/Sidebar.jsx
import React from 'react';
import { motion } from 'framer-motion';
import styles from './Sidebar.module.css';

const sidebarVariants = {
  hidden: { x: '-100%' },
  visible: { x: 0 },
  exit: { x: '-100%' },
};

const Sidebar = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <motion.div
        className={styles.sidebar}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={sidebarVariants}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.sidebarHeader}>
          <h2>Sidebar</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>
        {children}
      </motion.div>
    </>
  );
};

export default Sidebar;
