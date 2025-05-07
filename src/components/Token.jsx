import React, { useMemo } from 'react';
import styles from './Token.module.css';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';

// Memoizing the Token component to prevent unnecessary re-renders
const TokenCard = React.memo(({ token }) => {
  // Memoize chartData to avoid recalculating on every render
  const chartData = useMemo(() => 
    Array(10).fill().map((_, i) => ({
      name: `-${10 - i}h`,
      change: token.price_change_percentage_24h + (Math.random() - 0.5) * 2, // Simulated fluctuation
    })),
    [token]
  );

  return (
    <div className={styles.cryptocard}>
      <div className={styles.cryptocardLeft}>
        <img
          src={token.image}
          alt="Wallet Icon"
          className={styles.cryptocardImage}
        />
        <div className={styles.cryptocardNameCon}>
          <p className={styles.cryptocardName}>
            {token.id.slice(0, 8).charAt(0).toUpperCase() + token.id.slice(1, 8)}
          </p>
          <p className={styles.cryptocardPrice}>${token.current_price.toFixed(2)}</p>
        </div>
      </div>

      <div className={styles.cryptocardChange}>
        {/* Use fixed width/height to avoid recalculating layout */}
        <ResponsiveContainer width={100} height={50}>
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="change"
              stroke={token.price_change_percentage_24h >= 0 ? 'green' : 'red'}
              strokeWidth={2}
              dot={false}
            />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.cryptocardRight}>
        <p
          className={styles.cryptocardAmount}
          style={{ color: token.price_change_percentage_24h >= 0 ? 'green' : 'red' }}
        >
          {token.price_change_percentage_24h.toFixed(2)}
        </p>
      </div>
    </div>
  );
});

const Token = ({ data }) => {
  return (
    <div className={styles.container}>
      {data.map(token => (
        <TokenCard key={token.id} token={token} />
      ))}
    </div>
  );
};

export default Token;


