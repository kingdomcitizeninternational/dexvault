import { useEffect, useRef, useState } from "react";
import styles from "./UserNav.module.css";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [platform, setPlatform] = useState("desktop");
  const deferredPromptRef = useRef(null);

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform("ios");
    } else if (/android/.test(userAgent)) {
      setPlatform("android");
    } else {
      setPlatform("desktop");
    }

    // PWA install event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      deferredPromptRef.current = e;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () =>
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const installApp = () => {
    const promptEvent = deferredPromptRef.current;

    if (!promptEvent) {
      //alert("Install option is not available right now.");
      return;
    }

    promptEvent.prompt();
    promptEvent.userChoice.then((choice) => {
      if (choice.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      deferredPromptRef.current = null;
    });
  };

  return (
    <header className={styles.header}>
      <div className={styles.navbar}>
        <div className={styles.logo}>Dexvault</div>

        <nav className={styles.desktopNav}>
          <button className={styles.installButton} onClick={installApp}>
            Install App
          </button>
        </nav>

        <button
          className={styles.menuButton}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <button className={styles.mobileInstallButton} onClick={installApp}>
            Install App
          </button>
        </div>
      )}
    </header>
  );
};

export default Navigation;



