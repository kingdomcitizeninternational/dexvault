import React, { useEffect, useState, useRef } from 'react';

const InstallBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const deferredPromptRef = useRef(null);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isInStandalone = 'standalone' in window.navigator && window.navigator.standalone;

    if (isIOSDevice && !isInStandalone) {
      setIsIOS(true);
      setShowBanner(true);
    }

    const handler = (e) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      if (!isIOSDevice) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    const prompt = deferredPromptRef.current;
    if (!prompt) return;

    prompt.prompt();
    const result = await prompt.userChoice;
    if (result.outcome === 'accepted') {
      console.log('PWA installed');
    }
    deferredPromptRef.current = null;
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div style={styles.banner}>
      {isIOS ? (
        <div>
          <p style={styles.text}>
            📱 To install this app on your iPhone, tap <strong>Share</strong> 
            <span style={styles.icon}>🔗</span> and then <strong>Add to Home Screen</strong> 📲
          </p>
        </div>
      ) : (
        <>
          <p style={styles.text}>Install this app?</p>
          <button onClick={handleInstallClick} style={styles.button}>Install</button>
        </>
      )}
    </div>
  );
};

const styles = {
  banner: {
    position: 'fixed',
    bottom: '1rem',
    left: '1rem',
    right: '1rem',
    background: '#f9f9f9',
    border: '1px solid #ccc',
    padding: '1rem',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
    textAlign: 'center',
    zIndex: 9999,
    color: '#333',
  },
  text: {
    fontSize: '16px',
    lineHeight: '1.5',
  },
 
  icon: {
    margin: '0 0.25rem',
  },
  button: {
    marginTop: '0.75rem',
    padding: '0.5rem 1.25rem',
    background: '#4F46E5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default InstallBanner;


