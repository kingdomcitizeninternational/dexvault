import React from 'react';
import styles from './Transaction.module.css';
import { useSelector } from 'react-redux';
import { formatDate } from '../utils/utils';


const Transaction = () => {
  const { transactions } = useSelector(state => state.userAuth);
  const hasTransactions = transactions && transactions.length > 0;

  return (
    <div className={styles.card}>
      <h3 className={styles.heading}>Recent Transactions</h3>
      <div className={styles.transactionsList}>
        {hasTransactions ? (
          transactions.map((tx,index) => (
            <div key={index} className={styles.transactionItem}>
              <div className={styles.icon}></div>
              <div className={styles.details}>
                <div className={styles.txType}>
                  {tx.currency} <span className={styles.asset}>{tx.action}</span>
                </div>
                <div className={styles.date}>{formatDate(tx.date)}</div>
              </div>
              <div
                className={`${styles.amount} ${tx.amount.startsWith('+')
                  ? styles.green
                  : tx.amount.startsWith('-')
                    ? styles.red
                    : ''
                  }`}
              >
                {tx.amount}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noTransaction}>
            <p className={styles.noTransactionText}>No transactions</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transaction;

