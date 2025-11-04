import React from "react";
import { useLocation } from "react-router-dom";
import styles from './BottomTab.module.css';
import { FaHome, FaChartLine, FaCog, FaUser } from 'react-icons/fa';

const BottomTabs = ({ navigateTabHandler }) => {
    const location = useLocation();

    const isActive = (path) => location.pathname === `/${path}`;

    const tabs = [
        { label: 'Home', icon: <FaHome className={styles.icon} />, path: 'dashboard' },
        { label: 'portfolio', icon: <FaChartLine className={styles.icon} />, path: 'portfolio' },
        { label: 'profile', icon: <FaUser className={styles.icon} />, path: 'profile' },
        { label: 'Settings', icon: <FaCog className={styles.icon} />, path: 'settings' }
    ];

    return (
        <div className={styles.bottomTabContainer}>
            {tabs.map(tab => (
                <div
                    key={tab.path}
                    onClick={() => navigateTabHandler(tab.path)}
                    className={`${styles.tabItem} ${isActive(tab.path) ? styles.activeTab : ''}`}
                >
                    {tab.icon}
                    <span>{tab.label}</span>
                </div>
            ))}
        </div>
    );
};

export default BottomTabs;


