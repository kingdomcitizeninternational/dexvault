import React, { useState} from "react";
import styles from "./Network.module.css";
import { useDispatch, useSelector } from "react-redux";
import { changeChain } from "../store/action/appStorage";
import { Spinner } from "react-activity";
import { useNavigate } from "react-router-dom";



const allChainsAndCoins = [
  /*Btc chain  */
   { name: "Bitcoin", ticker: "BTC", chainId: 'btc', chainHex: "btc" },
   /*Evm chain  */
  { name: "Ethereum Mainnet", ticker: "ETH", chainId: 1, chainHex: "0x1" },
  { name: "BNB Smart Chain", ticker: "BNB", chainId: 56, chainHex: "0x38" },
  { name: "Polygon (Matic)", ticker: "MATIC", chainId: 137, chainHex: "0x89" },
 
  { name: "Arbitrum One", ticker: "ETH", chainId: 42161, chainHex: "0xa4b1" },

  { name: "Optimism", ticker: "ETH", chainId: 10, chainHex: "0xa" },
  { name: "Avalanche C-Chain", ticker: "AVAX", chainId: 43114, chainHex: "0xa86a" },
  { name: "Fantom Opera", ticker: "FTM", chainId: 250, chainHex: "0xfa" },
  { name: "Base", ticker: "ETH", chainId: 8453, chainHex: "0x2105" },
  { name: "zkSync Era", ticker: "ETH", chainId: 324, chainHex: "0x144" },
  { name: "Linea", ticker: "ETH", chainId: 59144, chainHex: "0xe708" },
  { name: "Scroll", ticker: "ETH", chainId: 534352, chainHex: "0x8284" },
  { name: "Cronos", ticker: "CRO", chainId: 25, chainHex: "0x19" },
  { name: "Gnosis (xDai)", ticker: "xDAI", chainId: 100, chainHex: "0x64" },
  { name: "Celo", ticker: "CELO", chainId: 42220, chainHex: "0xa4ec" },
  { name: "Moonbeam", ticker: "GLMR", chainId: 1284, chainHex: "0x504" },
  { name: "Moonriver", ticker: "MOVR", chainId: 1285, chainHex: "0x505" },
  { name: "Harmony", ticker: "ONE", chainId: 1666600000, chainHex: "0x63564c40" },
  { name: "Metis", ticker: "METIS", chainId: 1088, chainHex: "0x440" },
  { name: "Kava EVM", ticker: "KAVA", chainId: 2222, chainHex: "0x8ae" },
  { name: "Bitcoin", ticker: "BTC", chainId: null, chainHex: null },
  { name: "Litecoin", ticker: "LTC", chainId: null, chainHex: null },
  { name: "Ripple", ticker: "XRP", chainId: null, chainHex: null },
  { name: "Cardano", ticker: "ADA", chainId: null, chainHex: null },
  { name: "Dogecoin", ticker: "DOGE", chainId: null, chainHex: null },
  { name: "Polkadot", ticker: "DOT", chainId: null, chainHex: null },
  { name: "Tron", ticker: "TRX", chainId: null, chainHex: null },
  { name: "Cosmos", ticker: "ATOM", chainId: null, chainHex: null },
  { name: "Stellar", ticker: "XLM", chainId: null, chainHex: null },
  { name: "Near Protocol", ticker: "NEAR", chainId: null, chainHex: null },
  { name: "Bitcoin Cash", ticker: "BCH", chainId: null, chainHex: null },
];

const NetworkModal = ({ hideModal }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAuthError, setIsAuthError] = useState(false);
  const [authInfo, setAuthInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { address,seedphrase } = useSelector((state) => state.userAuth);

  const handleSelect = (e) => {
    const selected = JSON.parse(e.target.value);
    setSelectedOption(selected);
  };

  const selectHandler = async () => {
    if (!selectedOption) return;

    if(!address){
      //navigate to wallet screen
      console.log(address)
      return navigate('/login')
    }

    try {
      setIsLoading(true);
      const res = await dispatch(changeChain(selectedOption.chainHex, selectedOption.name, address,seedphrase))

      if (!res.bool) {
        setIsAuthError(true);
        setAuthInfo(res.message);
      } else {
        hideModal();
      }

      setIsLoading(false);
    } catch (error) {
      setIsAuthError(true);
      setAuthInfo(error.message);
      setIsLoading(false);
    }
  };

  const closeHandler = () => {
    hideModal();
  };









  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalView}>
        <span className="material-icons" style={{ width: "100%", textAlign: "start", cursor: "pointer" }} onClick={closeHandler}>
          close
        </span>
        <p className={styles.modalState}>Select blockchain network</p>

        <div className={styles.optionList}>
          <select className={styles.option} value={selectedOption ? JSON.stringify(selectedOption) : ""} onChange={handleSelect}>
            <option value="">-- Select a network --</option>
            {allChainsAndCoins.map((item) => (
              <option key={item.name} value={JSON.stringify(item)}>
                {item.name} ({item.ticker})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.modalButtonContainer}>
          <button className={styles.acceptBtn} onClick={selectHandler} disabled={isLoading}>
            {isLoading ? (
              <Spinner size={10} color="#fff" className={styles.loader} style={{ color: "#fff", fill: "#fff", stroke: "#fff" }} />
            ) : (
              "Select"
            )}
          </button>
          {isAuthError && <p style={{ color: "red" }}>{authInfo}</p>}
        </div>
      </div>
    </div>
  );
};

export default NetworkModal;


