import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './Loader.module.css';

const DashboardSkeleton = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {[...Array(8)].map((_, i) => (
          <div className={styles.card} key={i}>
            <div className={styles.header}>
              <Skeleton circle height={50} width={50} />
              <div className={styles.headerText}>
                <Skeleton height={20} width="80%" />
                <Skeleton height={15} width="60%" />
              </div>
              <Skeleton height={20} width={20} className={styles.icon} />
            </div>
            <Skeleton height={150} width="100%" className={styles.image} />
            <div className={styles.content}>
              <Skeleton height={15} width="90%" />
              <Skeleton height={15} width="100%" />
              <Skeleton height={15} width="70%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;

