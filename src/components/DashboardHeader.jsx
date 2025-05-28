import React, { useState } from 'react';
import styles from './DashboardHeader.module.css';
import { HiMenu } from 'react-icons/hi';
import { FaBell, FaUser } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DesktopHeader = ({ openMobileMenu, openBuyModalFun, openSendModalFun, sidebarOpen }) => {
    const navigate = useNavigate();
    const { user } = useSelector(state => state.userAuth);
    const [imageError, setImageError] = useState(false);
   const location = useLocation()
    const cleanPath = location.pathname.startsWith('/') ? location.pathname.slice(1) : location.pathname;


    const notificationHandler = () => {
        navigate('/notifications');
    };

    const profileHandler = () => {
        navigate('/profile');
    };

    return (
        <div className={styles.headerContainer}>
            <div className={styles.mobileHeader}>
                <HiMenu
                    color={sidebarOpen ? 'white' : 'black'}
                    size={25}
                    className={styles.hamburger}
                    onClick={openMobileMenu}
                />
                <FaBell color='black' size={25} className={styles.bell} onClick={notificationHandler} />
            </div>

            <div className={styles.title}>
                <h2>{cleanPath}</h2>
            </div>

            <div className={styles.buttonContainer}>
                <button className={styles.buysellbutton} onClick={openBuyModalFun}>
                    Buy & Sell
                </button>
                <button className={styles.sendreceivebutton} onClick={openSendModalFun}>
                    Send & receive
                </button>

                <button className={styles.notificationbutton} onClick={notificationHandler}>
                    <FaBell color='black' size={18} />
                    <span>55</span>
                </button>

                <button className={styles.imagebutton} onClick={profileHandler}>
                    {!imageError && user?.profilePhotoUrl ? (
                        <img
                            src={user.profilePhotoUrl}
                            alt="Profile"
                            style={{ width: '100%', height: '100%' }}
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <FaUser size={22} color="white" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default DesktopHeader;


