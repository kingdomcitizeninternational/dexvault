import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// Firebase config from .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// Generate FCM token and send it to your backend
export const generateToken = async (user) => {
  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    console.log("Notification permission granted.");

    try {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_VAPID_KEY,
      });

      if (token) {
        console.log("FCM Token:", token);

        // 👇 Send token to backend
        let res = await fetch('https://dexvault-backend.onrender.com/save-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token,user }), // Add userId or auth token if needed
        });

        console.log(res);
      } else {
        console.warn("No registration token available. Request permission to generate one.");
      }

    } catch (err) {
      console.error("An error occurred while retrieving token.", err);
    }
  } else {
    console.log("Notification permission denied.");
  }
};
