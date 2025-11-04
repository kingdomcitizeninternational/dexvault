import React, { useEffect } from "react";
import styles from "./portfoliomentFunds.module.css";
import AOS from "aos";
import "aos/dist/aos.css";

const investmentPackages = [
  {
    id: 1,
    name: "Starter Yield Plan",
    icon: "📈",
    minInvestment: "$100",
    returns: "0.5% daily",
    projection: "Earn ~$75 profit on $500 in 30 days",
    frequency: "Daily",
    color: "#4ade80",
  },
  {
    id: 2,
    name: "Growth Strategy Plan",
    icon: "🚀",
    minInvestment: "$1,000",
    returns: "0.8% daily",
    projection: "Earn ~$240 profit on $1,000 in 30 days",
    frequency: "Daily",
    color: "#60a5fa",
  },
  {
    id: 3,
    name: "Balanced Crypto Plan",
    icon: "💼",
    minInvestment: "$5,000",
    returns: "1.2% weekly",
    projection: "Earn ~$312 profit on $5,000 in 6 weeks",
    frequency: "Weekly",
    color: "#facc15",
  },
  {
    id: 4,
    name: "Advanced Portfolio Plan",
    icon: "📊",
    minInvestment: "$10,000",
    returns: "2.5% weekly",
    projection: "Earn ~$1,500 profit on $10,000 in 6 weeks",
    frequency: "Weekly",
    color: "#f87171",
  },
  {
    id: 5,
    name: "Elite Investor Plan",
    icon: "🏦",
    minInvestment: "$25,000",
    returns: "3.2% weekly",
    projection: "Earn ~$4,800 profit on $25,000 in 6 weeks",
    frequency: "Weekly",
    color: "#a78bfa",
  },
];

const InvestmentSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section className={styles.wrapper} id="investment" data-aos="fade-up">
      <div className={styles.heading}>
        <h2>Crypto Investment Packages</h2>
        <p>
          Choose from a variety of professionally designed investment plans. Invest with any cryptocurrency
          and enjoy consistent daily or weekly returns. All plans are backed by smart strategies and expert risk management.
        </p>
      </div>

      <div className={styles.grid}>
        {investmentPackages.map((pkg) => (
          <div className={styles.card} key={pkg.id} data-aos="zoom-in">
            <div className={styles.cardHeader}>
              <div className={styles.icon} style={{ backgroundColor: pkg.color }}>
                {pkg.icon}
              </div>
              <div>
                <h3 className={styles.packageName}>{pkg.name}</h3>
                <p className={styles.asset}>Minimum Investment: {pkg.minInvestment}</p>
              </div>
            </div>

            <div className={styles.details}>
              <p className={styles.returns}>Return: {pkg.returns} ({pkg.frequency})</p>
              <p className={styles.projection}>{pkg.projection}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InvestmentSection;


