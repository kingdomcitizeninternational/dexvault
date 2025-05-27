import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import {
  FaWallet, FaUserAlt, FaCreditCard, FaBell,
  FaCog, FaSignOutAlt, FaTachometerAlt
} from 'react-icons/fa';
import styles from './MobileSideBar.module.css';
import { useSelector } from 'react-redux';

const Sidebar = ({ isOpen, toggleSidebar, isInvest, navigateMobileHandler }) => {
  const { user } = useSelector(state => state.userAuth);
  const location = useLocation();

  const baseLinks = [
    { to: "dashboard", icon: <FaWallet />, label: "Wallet" },
    { to: "profile", icon: <FaUserAlt />, label: "Profile" },
    { to: "portfolio", icon: <FaTachometerAlt />, label: "Portfolio" },
  ];

  const investLinks = [
    { to: "trade-center", icon: <FaTachometerAlt />, label: "Trade Center" },
    { to: "fund-account", icon: <FaTachometerAlt />, label: "Fund Account" },
    { to: "withdraw", icon: <FaTachometerAlt />, label: "Withdraw" },
    { to: "upgrade", icon: <FaTachometerAlt />, label: "Upgrade" },
  ];

  const nonInvestLinks = [
    { to: "transactions", icon: <FaCreditCard />, label: "Transactions" },
    { to: "notifications", icon: <FaBell />, label: "Notifications" },
    { to: "settings", icon: <FaCog />, label: "Settings" },
  ];

  const commonLinks = [
    { to: "logout", icon: <FaSignOutAlt />, label: "Log Out" },
  ];

  const allLinks = [
    ...baseLinks,
    ...(isInvest ? investLinks : nonInvestLinks),
    ...commonLinks
  ];

  return (
    <>
      <motion.div
        className={styles.sidebar}
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* User Info */}
        <div className={styles.userProfile}>
          <img src={user?.profilePhotoUrl} alt="User" className={styles.avatar} />
          <p className={styles.username}>
            {user?.firstName?.slice(0, 7)}.. {user.lastName?.slice(0, 7)}..
          </p>
        </div>

        {/* Navigation Links */}
        <ul className={styles.sidebarLinks}>
          {allLinks.map(({ to, icon, label }) => (
            <li key={to}>
              <NavLink
                to={`/${to}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigateMobileHandler(to);
                }}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.activeLink : ''}`
                }
              >
                {icon} {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Overlay */}
      {isOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;



