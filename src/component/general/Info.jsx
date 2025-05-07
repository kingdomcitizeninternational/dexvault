import React, { useEffect, useRef, useState } from 'react';
import styles from './Info.module.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import CountUp from 'react-countup';

function Info() {
  const [volume, setVolume] = useState(217); // in Billions
  const [countries, setCountries] = useState(100); // just a base
  const [users, setUsers] = useState(103); // in Millions

  const intervalRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    intervalRef.current = setInterval(() => {
      setVolume((prev) => parseFloat((prev + 0.001).toFixed(3))); // even slower +0.001B
      setCountries((prev) => (prev < 150 ? prev + 0.2 : prev)); // slower, increments by 0.2
      setUsers((prev) => parseFloat((prev + 0.005).toFixed(3))); // slower +0.005M users
    }, 1000000); // every 7 seconds

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className={styles.info_section} data-aos="fade-up">
      <div className={styles.info_container}>
        <div className={styles.info}>
          <h1>
            <CountUp end={volume} duration={10} decimals={3} prefix="$" suffix="B" />
          </h1>
          <p>Quarterly volume traded across the platform</p>
        </div>

        <div className={styles.info}>
          <h1>
            <CountUp end={countries} duration={10} decimals={1} suffix="+" />
          </h1>
          <p>Countries where we offer secure crypto transactions</p>
        </div>

        <div className={styles.info}>
          <h1>
            <CountUp end={users} duration={10} decimals={3} suffix="M+" />
          </h1>
          <p>Verified users trust our crypto wallet for secure management</p>
        </div>
      </div>
    </div>
  );
}

export default Info;


