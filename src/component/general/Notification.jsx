// NotificationToast.js
import React from 'react';

export const NotificationToast = ({ title, message, image }) => {
  return (
    <div style={styles.container}>
      <img src={image} alt="icon" style={styles.image} />
      <div>
        <div style={styles.title}>{title}</div>
        <div style={styles.message}>{message}</div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    width: '100%',
    maxWidth: '400px',
    gap: '12px',
  },
  image: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
  },
  title: {
    fontWeight: '600',
    fontSize: '16px',
  },
  message: {
    fontSize: '14px',
    color: '#555',
  },
};

