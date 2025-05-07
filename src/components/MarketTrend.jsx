import React from 'react';
import styles from './MarketTrend.module.css';

const MarketTrend = ({ data }) => {
    const hasTokens = data && data.length > 0;

    return (
        <div className={styles.container}>
            {hasTokens ? (
                data.map((token) => (
                    <div className={styles.cryptocard} key={token.id}>
                        <div className={styles.cryptocardLeft}>
                            <img
                                src={token.logo}
                                alt={`${token.id} icon`}
                                className={styles.cryptocardImage}
                            />
                            <div className={styles.cryptocardNameCon}>
                                <p className={styles.cryptocardName}>
                                    {token.name.charAt(0).toUpperCase() + token.id.slice(1, 8)}
                                </p>
                            </div>
                        </div>

                        <div className={styles.cryptocardRight}>
                            <p className={styles.cryptocardPrice}>
                                ${token?.balance?.toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <div className={styles.noTokenContainer}>
                    <p className={styles.noTokenText}>No token yet</p>
                </div>
            )}
        </div>
    );
};

export default MarketTrend;


