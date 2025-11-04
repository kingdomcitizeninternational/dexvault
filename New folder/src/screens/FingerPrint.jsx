// FingerprintAuth.js
import React, { useState } from 'react';

export default function FingerprintAuth() {
  const [status, setStatus] = useState("Idle...");

  const handleAuthenticate = async () => {
    setStatus("Checking for WebAuthn support...");

    if (!window.PublicKeyCredential) {
      setStatus("WebAuthn not supported in this browser.");
      return;
    }

    try {
      setStatus("Requesting fingerprint authentication...");

      const credential = await navigator.credentials.get({
        publicKey: {
          // AllowCredentials would normally come from your backend
          challenge: new Uint8Array(32),
          allowCredentials: [],
          timeout: 60000,
          userVerification: 'required',
        },
      });

      console.log("Authenticated credential:", credential);
      setStatus("✅ Fingerprint Auth Success!");
    } catch (error) {
      console.error("Authentication failed", error);
      setStatus("❌ Authentication failed or canceled.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Fingerprint Authentication</h2>
      <button onClick={handleAuthenticate} style={styles.button}>
        Authenticate with Fingerprint
      </button>
      <p>{status}</p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '100px auto',
    textAlign: 'center',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};
