import React from 'react';
import ContentLoader from 'react-content-loader';
import styles from './HomeLoader.module.css';

const UniversalLoader = (props) => (
  <div className={styles.loaderWrapper}>
    {/* Header */}
    <ContentLoader
      speed={1.5}
      width="100%"
      height={60}
      viewBox="0 0 1000 60"
      backgroundColor="#ecebeb"
      foregroundColor="#d6d2d2"
      {...props}
    >
      <rect x="20" y="15" rx="10" ry="10" width="200" height="30" />
      <rect x="240" y="15" rx="10" ry="10" width="120" height="30" />
      <rect x="380" y="15" rx="10" ry="10" width="120" height="30" />
    </ContentLoader>

    {/* Wallet Balance Card */}
    <ContentLoader
      speed={1.5}
      width="100%"
      height={120}
      viewBox="0 0 1000 120"
      backgroundColor="#ecebeb"
      foregroundColor="#d6d2d2"
      {...props}
    >
      <rect x="20" y="20" rx="20" ry="20" width="90%" height="80" />
    </ContentLoader>

    {/* Chart Section - 2 columns */}
    <div className={styles.chartSection}>
      <ContentLoader
        speed={1.5}
        width="100%"
        height={200}
        viewBox="0 0 1000 200"
        backgroundColor="#ecebeb"
        foregroundColor="#d6d2d2"
        {...props}
      >
        {/* Pie Chart */}
        <circle cx="100" cy="100" r="60" />
        <rect x="180" y="70" rx="6" ry="6" width="120" height="20" />
        <rect x="180" y="100" rx="6" ry="6" width="120" height="20" />
        <rect x="180" y="130" rx="6" ry="6" width="120" height="20" />
      </ContentLoader>

      <ContentLoader
        speed={1.5}
        width="100%"
        height={200}
        viewBox="0 0 1000 200"
        backgroundColor="#ecebeb"
        foregroundColor="#d6d2d2"
        {...props}
      >
        {/* Line Chart */}
        <rect x="20" y="30" rx="10" ry="10" width="90%" height="40" />
        <rect x="20" y="80" rx="10" ry="10" width="90%" height="100" />
      </ContentLoader>
    </div>

    {/* Asset Cards / List Items */}
    <div className={styles.assetGrid}>
      {Array.from({ length: 6 }).map((_, idx) => (
        <ContentLoader
          key={idx}
          speed={1.5}
          width="100%"
          height={80}
          viewBox="0 0 1000 80"
          backgroundColor="#ecebeb"
          foregroundColor="#d6d2d2"
          {...props}
        >
          <circle cx="40" cy="40" r="20" />
          <rect x="70" y="20" rx="8" ry="8" width="200" height="15" />
          <rect x="70" y="45" rx="8" ry="8" width="100" height="12" />
          <rect x="300" y="30" rx="8" ry="8" width="100" height="20" />
        </ContentLoader>
      ))}
    </div>

    {/* Footer Buttons */}
    <ContentLoader
      speed={1.5}
      width="100%"
      height={70}
      viewBox="0 0 1000 70"
      backgroundColor="#ecebeb"
      foregroundColor="#d6d2d2"
      {...props}
    >
      <rect x="50" y="15" rx="10" ry="10" width="28%" height="40" />
      <rect x="360" y="15" rx="10" ry="10" width="28%" height="40" />
      <rect x="670" y="15" rx="10" ry="10" width="28%" height="40" />
    </ContentLoader>
  </div>
);

export default UniversalLoader;

