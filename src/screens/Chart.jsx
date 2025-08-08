import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import extrastyles from './Chart.module.css';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

const MultiCoinChart = () => {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h'
        );
        const data = await res.json();
        setCoins(data);
        setSelectedCoin(data[0]);
      } catch (error) {
        console.error('Failed to fetch coins', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  const getChartData = (coin) => ({
    labels: coin.sparkline_in_7d.price.map((_, i) => i),
    datasets: [
      {
        data: coin.sparkline_in_7d.price,
        borderColor: coin.price_change_percentage_24h >= 0 ? '#16c784' : '#ea3943',
        backgroundColor: 'transparent',
        pointRadius: 0,
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  });

  return (
    <div style={styles.wrapper}>
      <div style={styles.card} className={extrastyles.card}>
       
        {loading ? (
          <div style={styles.loader}>
            <img
              src="data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgNDAgNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjNGZhOTRkIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIgMikiIHN0cm9rZS13aWR0aD0iMyI+PGNpcmNsZSBzdHJva2Utb3BhY2l0eT0iLjUiIGN4PSIxOCIgc3Ryb2tlPSIjNGZhOTRkIiBjeT0iMTgiIHI9IjE4Ii8+PHBhdGggZD0iTTM2IDE4YzAtOS45NC04LjA2LTE4LTE4LTE4Ij48YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InJvdGF0ZSIgZnJvbT0iMCAxOCAxOCIgdG89IjM2MCAxOCAxOCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz48L3BhdGg+PC9nPjwvZz48L3N2Zz4="
              alt="Loading..."
              style={{ width: 50 }}
            />
            <p style={{ marginTop: 10 }}>Fetching coin data...</p>
          </div>
        ) : (
          <>
            <div style={styles.selectContainer}>
              <label htmlFor="coin-select" style={styles.label}>Choose Coin:</label>
              <select
                id="coin-select"
                value={selectedCoin?.id}
                onChange={(e) => {
                  const coin = coins.find((c) => c.id === e.target.value);
                  setSelectedCoin(coin);
                }}
                style={styles.select}
              >
                {coins.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {selectedCoin && (
              <div style={styles.chartArea}>
                <div style={styles.coinInfo}>
                  <img src={selectedCoin.image} alt={selectedCoin.name} style={styles.coinImg} />
                  <div>
                    <h4 style={styles.coinName}>{selectedCoin.name}</h4>
                    <p style={styles.coinPrice}>
                      ${selectedCoin.current_price.toLocaleString()} &nbsp;|&nbsp;
                      <span style={{ color: selectedCoin.price_change_percentage_24h >= 0 ? '#16c784' : '#ea3943' }}>
                        {selectedCoin.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </p>
                  </div>
                </div>

                <div style={styles.chartContainer}>
                  <Line
                    data={getChartData(selectedCoin)}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: { x: { display: false }, y: { display: false } },
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    width:'100%',
    padding:'20px',
    paddingBottom:'40px'
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
    padding: '20px',
    boxSizing: 'border-box',
    background:'#3a3d47',
  },
  header: {
    marginBottom: 20,
    fontSize: 22,
    fontWeight: 600,
    color: '#222',
    textAlign: 'center',
  },
  loader: {
    textAlign: 'center',
    padding: 40,
  },
  selectContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 20,
  },
  label: {
    fontWeight: 500,
    fontSize: 14,
    color: '#fff',
  },
  select: {
    padding: 10,
    borderRadius: 8,
    border: '1px solid #ccc',
    fontSize: 14,
    width:'130px',
    background:'grey'
  },
  chartArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  coinInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  coinImg: {
    width: 36,
    height: 36,
  },
  coinName: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
  },
  coinPrice: {
    margin: 0,
    fontSize: 14,
    color: '#777',
  },
  chartContainer: {
    width: '100%',
    height: 300,
  },
};

export default MultiCoinChart;

