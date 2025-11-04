import React, { useState, useEffect } from 'react';
//import nav bar
import NavBar from "../component/general/UserNav"
import GetStarted from "../component/general/getStarted"
//import CoinSection from "../component/general/coinSection"
import EarningSection from "../component/general/earningSection"
import PortfolioSection from "../component/general/portfolio"
import SecuritySection from "../component/general/Security"
import InfoSection from "../component/general/Info"
import Footer from "../component/general/Footer"
import EarnSection from '../component/general/earnSection';
import { DownloadButton } from '../component/general/DownloadButton';
import InvestmentFunds  from "../component/general/portfoliomentFunds"



function Home() {
    let [download, setDownload] = useState(false)
    let navigateToApp = () => {
        //alert('navigating')
    }

    useEffect(() => {
        
    },[])

    let closeHandler =()=>{
        setDownload(false)

    }


    return (<>
        <NavBar navigateToApp={navigateToApp} />

        <GetStarted navigateToApp={navigateToApp} />
        
    
        <EarnSection navigateToApp={navigateToApp} />

        <PortfolioSection navigateToApp={navigateToApp} />

        <SecuritySection navigateToApp={navigateToApp} />

        <InfoSection navigateToApp={navigateToApp} />
        <InvestmentFunds/>


        <Footer />
    </>

    );
}

export default Home;