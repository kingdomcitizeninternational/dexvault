import React, { useState, useEffect,useCallback } from 'react';

import styles from './coinSection.module.css'
//import nav bar
import { loadCoins } from "../../store/action/userAppStorage";
import { useDispatch } from "react-redux";
//importing modals
import LoadingModal from "./LoadingModal"
import Modal from "./Modal"
//import routers
import { useNavigate } from 'react-router-dom'
import AOS from 'aos';
import "aos/dist/aos.css";
import { useSelector } from "react-redux";


function CoinSection() {
    let [isError, setIsError] = useState(false)
    let [isErrorInfo, setIsErrorInfo] = useState(false)
    let [isLoading, setIsLoading] = useState(false)
    let [coins, setCoins] = useState([])
    let [filteredCoins, setFilteredCoins] = useState([])
    let dispatch = useDispatch()
    let navigate = useNavigate()


    let { user, assetList } = useSelector(state => state.userAuth)

    useEffect(async () => {
        loadingCoins()
    }, [])


    let loadingCoins = useCallback(async () => {
        if (isLoading || filteredCoins.length > 0) {
            return
        }
        setIsLoading(true)
        if (assetList.length > 0) {
            setCoins(assetList)
            setFilteredCoins(assetList)
            setIsLoading(false)
            setIsError(false)
            return

        }
        let res = await dispatch(loadCoins(1, 100))
        if (!res.bool) {
            setIsLoading(false)
            return
        }
        setCoins(res.message)
        console.log(res.message)
        setFilteredCoins(res.message)
        setIsLoading(false)
        setIsError(false)

    }, [])





    useEffect(() => {
        AOS.init({
            duration: 1000
        });
    })




    const closeModal = () => {
        setIsError(false)
    }

    return (<>
        {isError && <Modal showModal={isError} closeModal={closeModal} content={isErrorInfo} />}
        {isLoading && <LoadingModal />}


        {filteredCoins.length > 0 && <div className={styles.cointable_container} data-aos="fade-up">

            {filteredCoins.slice(0,4).map((data, index) => <div className={styles.cointable_mobile} key={index}>
                <div className={styles.cointable_mobile_left}>
                    <div className={styles.cointable_mobile_left_imgCon}>
                        <img src={data.image} />

                    </div>

                    <div className={styles.cointable_mobile_left_symbols}>
                        <p>{data.id}</p>
                        <p>{data.symbol.toUpperCase()}</p>

                    </div>

                </div>
                <div className={styles.cointable_mobile_right}>
                    <p>${data.current_price.toFixed(2)}</p>
                    <p style={{ color: data.price_change_percentage_24h < 0 ? 'red' : 'green' }} >{data.price_change_percentage_24h.toFixed(2)}%</p>

                </div>

            </div>)}

            <div className={styles.cointable_desktop} data-aos="fade-up" >
                <table>
                    <thead>
                        <tr>
                            <th className={styles.number}>#</th>
                            <th className={styles.name}>Name</th>
                            <th className={styles.price}>Price</th>
                            <th className={styles.change}>Change</th>

                            <th className={styles.trade}>Trade</th>
                        </tr>

                    </thead>
                    <tbody>
                        {filteredCoins.slice(0, 5).map((data, index) => <tr key={index}>
                            <td className={styles.number}>{index + 1}</td>
                            <td className={styles.name}>
                                <div className={styles.tableCellContainer}>
                                    <img src={data.image} />
                                    <p>{data.name}</p>
                                    <p>{data.symbol.toUpperCase()}</p>

                                </div>


                            </td>
                            <td className={styles.price}>${data.current_price.toFixed(2)}</td>
                            <td style={{ color: data.price_change_percentage_24h ? 'red' : 'green' }} className={styles.change}>{data.price_change_percentage_24h.toFixed(2)}%</td>

                            <td className={styles.trade}><button>Buy</button></td>
                        </tr>)}

                    </tbody>
                </table>

            </div>
            
        </div>}
    </>

    );
}

export default CoinSection;







