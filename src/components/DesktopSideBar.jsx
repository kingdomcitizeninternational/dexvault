import React from 'react';
import {
  FaBell,
  FaUser,
  FaCog,
  FaHome,
  FaSignOutAlt,
  FaExchangeAlt,
  FaTachometerAlt,
  FaWallet // <-- Add this
} from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import styles from './DesktopSideBar.module.css';

const DesktopSideBar = ({ isInvest, navigateMobileHandler }) => {
  const location = useLocation();

  const baseLinks = [
    { to: "dashboard", icon: <FaWallet />, label: "Wallet" }, // <-- Updated icon here
    { to: "profile", icon: <FaUser />, label: "Profile" },
    { to: "portfolio", icon: <FaTachometerAlt />, label: "Portfolio" },
  ];


  const investLinks = [

    { to: "trade-center", icon: <FaTachometerAlt />, label: "Trade Center" },
    { to: "fund-account", icon: <FaTachometerAlt />, label: "Fund Account" },
    { to: "withdraw", icon: <FaTachometerAlt />, label: "Withdraw" },
    { to: "upgrade", icon: <FaTachometerAlt />, label: "Upgrade" },
  ];

  const nonInvestLinks = [
    { to: "transactions", icon: <FaExchangeAlt />, label: "Transactions" },
    { to: "notifications", icon: <FaBell />, label: "Notifications" },
    { to: "settings", icon: <FaCog />, label: "Settings" },
  ];

  const commonLinks = [
    { to: "logout", icon: <FaSignOutAlt />, label: "Logout" },
  ];

  const allLinks = [
    ...baseLinks,
    ...(isInvest ? investLinks : nonInvestLinks),
    ...commonLinks,
  ];

  return (
    <div className={styles.sidebarContent}>

      <div className={styles.titleCon}>

        <div className={styles.titleContainer}>
          <h2 className={styles.sidebarTitle}>Dexvault</h2>
        </div>

      </div>

      <nav className={styles.nav}>
        {allLinks.map(({ to, icon, label }) => {
          const isActive = location.pathname === `/${to}`;

          return (
            <div
              key={to}
              onClick={() => navigateMobileHandler(to)}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              style={{ cursor: 'pointer' }} // optional, makes it clear it's clickable
            >
              {icon}
              <p>{label}</p>
            </div>
          );
        })}

      </nav>
    </div>
  );
};

export default DesktopSideBar;

