import React, { useEffect, useRef, useState } from "react";
import styles from "./Footer.module.css";
import {
  FaApple,
  FaAndroid,
  FaDesktop,
  FaTwitter,
  FaTelegramPlane,
  FaGithub,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const Footer = () => {
  const [platform, setPlatform] = useState("desktop");
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOSStandalone, setIsIOSStandalone] = useState(false);
  const deferredPromptRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const userAgent = navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = window.navigator.standalone;

    if (isIOSDevice) {
      setPlatform("ios");
      setIsIOSStandalone(isStandalone);
      if (!isStandalone) setShowInstallBanner(true);
    } else if (/android/.test(userAgent)) {
      setPlatform("android");
    } else {
      setPlatform("desktop");
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      setShowInstallBanner(true);
    };

    const handleAppInstalled = () => {
      console.log("App successfully installed");
      setShowInstallBanner(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handlePWAInstall = async () => {
    const prompt = deferredPromptRef.current;
    if (prompt) {
      prompt.prompt();
      const result = await prompt.userChoice;
      console.log(result.outcome === "accepted" ? "User installed the app" : "User dismissed install");
      deferredPromptRef.current = null;
      setShowInstallBanner(false);
    } else {
      console.log("Install prompt not available");
    }
  };

  const handleIOSInstall = () => {
    alert(
      "To install this app on iOS:\n\n1. Open Safari\n2. Tap the Share icon\n3. Tap 'Add to Home Screen'"
    );
  };

  const handleUniversalInstall = () => {
    if (platform === "ios" && !isIOSStandalone) {
      handleIOSInstall();
    } else {
      handlePWAInstall();
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.downloadSection} data-aos="fade-up">
        <h3>Download Our App</h3>
        <p>Manage your crypto on any device. Available for Android, iOS, and Desktop.</p>

        <div className={styles.downloadButtons}>
          <button className={styles.downloadBtn} onClick={handleUniversalInstall}>
            <FaApple /> iOS App
          </button>
          <button className={styles.downloadBtn} onClick={handleUniversalInstall}>
            <FaAndroid /> Android App
          </button>
          <button className={styles.downloadBtn} onClick={handleUniversalInstall}>
            <FaDesktop /> Desktop App
          </button>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.brand}>
          <h2>dexvault</h2>
          <p>
            Securely manage your crypto assets, explore smart investment packages,
            and grow your wealth confidently with dexvault.
          </p>
        </div>

        <div className={styles.links}>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/wallet">Wallet</a></li>
            <li><a href="/portfolioments">Investments</a></li>
            <li><a href="/support">Support</a></li>
            <li><a href="/faq">FAQs</a></li>
          </ul>
        </div>

        <div className={styles.socials}>
          <h4>Connect</h4>
          <div className={styles.icons}>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaTelegramPlane /></a>
            <a href="#"><FaGithub /></a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} dexvault. All rights reserved.</p>
      </div>

      {showInstallBanner && (
        <div className={styles.installBanner}>
          <p>
            Install our app for a better experience on your{" "}
            {platform === "ios" ? "iOS device" : platform}.
          </p>
          <div className={styles.bannerActions}>
            <button onClick={handleUniversalInstall}>Install Now</button>
            <button onClick={() => setShowInstallBanner(false)}>Dismiss</button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;












