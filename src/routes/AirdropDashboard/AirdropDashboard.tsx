import React, { useEffect, useState } from "react";
import "./AirdropDashboard.css";
import styled from 'styled-components';
import Header from "../../components/Header";
import {BarLegend, BarLegendComponent, BarSection} from "../../components/AirdropBar";
import { FaDollarSign } from "react-icons/fa";

import { MdExpandMore } from "react-icons/md";

interface AirdropDashboardProps {
  contractAddress: string;
  etherscanDomain: string;
}

const testData = {
  poolValue: 824746.56,
  nftHolders: 1346,
  rewardsPerHolder: 612.74,
  teams: [
    { name: "BASE TEAM", amount: "100 ETH", reward: 260000 },
    { name: "BRETT TEAM", amount: "1,426,263 BRETT", reward: 250000 },
    { name: "DEGEN TEAM", amount: "10,000,000 DEGEN", reward: 214000 },
    { name: "FUNNY NAME", amount: "69 ETH", reward: 145000 },
    { name: "FUNNY NAME 2", amount: "90,245 AAVE", reward: 100000 },
    { name: "DEGEN TEAM", amount: "10,000,000 DEGEN", reward: 214000 },
    { name: "FUNNY NAME", amount: "69 ETH", reward: 145000 },
    { name: "DEGEN TEAM", amount: "10,000,000 DEGEN", reward: 214000 },
    { name: "FUNNY NAME", amount: "69 ETH", reward: 145000 },
    { name: "DEGEN TEAM", amount: "10,000,000 DEGEN", reward: 214000 },
    { name: "FUNNY NAME", amount: "69 ETH", reward: 145000 },
    { name: "DEGEN TEAM", amount: "10,000,000 DEGEN", reward: 214000 },
    { name: "FUNNY NAME", amount: "69 ETH", reward: 145000 },
    { name: "DEGEN TEAM", amount: "10,000,000 DEGEN", reward: 214000 },
    { name: "FUNNY NAME", amount: "69 ETH", reward: 145000 },
    { name: "DEGEN TEAM", amount: "10,000,000 DEGEN", reward: 214000 },
    { name: "FUNNY NAME", amount: "69 ETH", reward: 145000 },
  ]
};

const AirdropDashboard = ({ contractAddress, etherscanDomain }: AirdropDashboardProps) => {
  const [poolValueData, setPoolValueData] = useState({});
  const [rewardPerHolderData, setRewardPerHolderData] = useState({});

   const [airdropData, setAirdropData] = useState({});
  
  const [openAirdropAddress, setopenAirdropAddress] = useState(false);

 
;
  function returnHome(){
    window.location.href = '/';
  }

  const colors = [
   "#0004FF", 
    "#3033FF", 
    "#6467FF", 
    "#9A9BFF", 
    "#D1D2FF", 
  ];



  useEffect(() => {
    fetch('https://getcurrentstamp-kdyjilgzba-uc.a.run.app/').then((response) => response.json())
    .then((data) => {
      // Extrahiere den Wert, z.B. den Titel des ersten Posts
      console.log("---airdropData", data.data);
      setAirdropData(data?.data); // Beispiel: Titel des ersten Posts
    })
    .catch((error) => console.error('Error fetching data:', error));

    console.log("airdropPool", airdropData);
  },[]);

  useEffect(() => {
    fetch('https://fullpoolvalue-kdyjilgzba-uc.a.run.app/').then((response) => response.json())
    .then((data) => {
      // Extrahiere den Wert, z.B. den Titel des ersten Posts
      // console.log("---poolValueData", data);
      setPoolValueData(data?.poolValue); // Beispiel: Titel des ersten Posts
    })
    .catch((error) => console.error('Error fetching data:', error));

    // console.log("poolValueData", poolValueData);
  }, []);

  useEffect(() => {
    fetch('https://rewardperholder-kdyjilgzba-uc.a.run.app/').then((response) => response.json())
    .then((data) => {
      //console.log("---rewardPerHolderData", data);
      // Extrahiere den Wert, z.B. den Titel des ersten Posts
      setRewardPerHolderData(data?.rewardPerHolder); // Beispiel: Titel des ersten Posts
    })
    .catch((error) => console.error('Error fetching data:', error));

    //console.log("rewardPerHolderData", rewardPerHolderData);
  }, []);

  useEffect(() => {
    fetch('https://nftholders-kdyjilgzba-uc.a.run.app/').then((response) => response.json())
    .then((data) => {
      // Extrahiere den Wert, z.B. den Titel des ersten Posts
      
      setHolderAmountData(data?.nftHolders); // Beispiel: Titel des ersten Posts
    })
    .catch((error) => console.error('Error fetching data:', error));

    //console.log("holderAmountData", holderAmountData);
  }, []);

  return (
    <>
      
      {/*<Header text={"Home"}  onClick={ () => returnHome}/>*/}
      <div className="airdrop-dashboard">
        
        <div className="content-wrapper">
          <div className="airdrop-content">
              <div className="dashboard-wrapper">
                <div className="dashboard-content">
                 
                  <div className="airdrop-subheader-section">
                    <h1 className="airdrop-header">dGEN1 AIRDROP DASHBOARD</h1> 
                    <div style={{display:'flex', flexDirection:'row', gap: '0.5em', alignItems:'center'}}>
                      <div><h3 className="topfive-legend-title">AIRDROP ADDRESS</h3></div>
                
                    </div>
                    
                    
                      <h2 className="airdrop-subheader">0xBb8e3AAcA1eb131a375b86133e42e920Aa63D44B</h2>
                    <div className="airdrop-data-legend">
    
                      
                        <h3 className="network-legend-text" style={{marginRight: '0.3em'}}>ONLY ON</h3>
                        <BarLegendComponent color= {"#0052FF"}>
                          <div className="data-legend-point"></div>
                          <h3 className="network-legend-text">BASE</h3>
                        </BarLegendComponent>
                        <BarLegendComponent color= {"#3033FF"}>
                          <div className="data-legend-point"></div>
                          <h3 className="network-legend-text">MAINNET</h3>
                        </BarLegendComponent>
                        <BarLegendComponent color= {"#FE0420"}>
                          <div className="data-legend-point"></div>
                          <h3 className="network-legend-text">OPTIMISM</h3>
                        </BarLegendComponent>
                        <BarLegendComponent color= {"#213147"}>
                          <div className="data-legend-point"></div>
                          <h3 className="network-legend-text">ARBITRUM</h3>
                        </BarLegendComponent>
                            
                    </div>
                    
                    
                  </div>    
                          
                  
                    <div className="airdrop-data">


                      <div className="dashboard-header">
                        <div className="dashboard-header-section-pool">
                          <h3 className="dashboard-header-title">Pool Value [USD]</h3>
                          <div className="dashboard-header-divider"></div>
                          <h5 className="dashboard-header-subtitle">
                            {typeof poolValueData === 'object' || poolValueData === undefined ? <>...</> : <>${formatSimpleAmount(poolValueData).toLocaleString()}</>}
                          </h5>
                        </div>
                        <div className="dashboard-header-section-rewards">
                          <div className="reward-text">
                          <h3 className="dashboard-header-title">&#65284; / Holder</h3>
                          </div>
                          <div className="dashboard-header-divider"></div>
                          
                          <h5 className="dashboard-header-subtitle">
                          {typeof rewardPerHolderData === 'object' ? <>...</> : <>${formatSimpleAmount(Number(rewardPerHolderData).toFixed(2))}</>}
                          </h5>
                        </div>
                        
                      </div>

                      
                      <div style={{display:'flex', flexDirection:'column', gap: '0em', justifyContent:'start'}}>
                      <h3 className="topfive-legend-title">TOP 5</h3>
                        
                      <div className="airdrop-bar">

                          {Array.isArray(airdropData?.allTokens) && airdropData.allTokens.length > 0 ? (
                              <>
                                {airdropData.allTokens.slice(0, 5).map((team, index) => (
                                  <BarSection 
                                    key={index}
                                    number={formatSimpleAmount(team.value)}
                                    desc={team.name}
                                    color={colors[index % colors.length]}
                                    precent={poolValueData ? Number((team.value / poolValueData) * 100).toFixed(2) : 1}
                                  />
                                ))}
                              
                              </>
                            ) : (
                              <div className="no-data">
                                <p>...</p> 
                              </div>
                            )}
                        
                        

                      </div>
                      </div>

                      

                  
                    </div>

                  <div className="teams-table">
                    
                      <div className="teams-header">
                        <div className="teams-header-name">Name</div>
                  
                        <div className="teams-header-amount">Amount</div>
                        
                        <div className="teams-header-reward">Value</div>
                      </div>

                      <div className="dashboard-header-horizontal-divider"/>

                      <div className="teams-list">
                        {Array.isArray(airdropData?.allTokens) && airdropData.allTokens.length > 0 ? (
                          airdropData.allTokens.map((team, index) => (
                            <div className="teams-row" key={index}>
                              <div style={{display:'flex', flexDirection:'row', gap: '1em', alignItems:'center'}}>
                                 {index <= 4 ?(
                                    <TeamsRowName color={colors[index % colors.length]}>${team.name}</TeamsRowName>
                                 ): (
                                  <TeamsRowName>${team.name}</TeamsRowName>
                                
                                 )} 
                              
                              </div>
                              
                            
                              <div className="teams-row-amount">{formatAmount(team.totalAmount)}</div>
                              <div className="teams-row-reward">${team.value}</div>
                            </div>
                          ))
                        ) : (
                          <div className="no-data">
                            <p>...</p> 
                          </div>
                        )}
                        
                        
                      </div>
                  
                  </div>
                </div>

                

              </div>
              
          </div>
          
        </div>
        
      </div>
    </>
  );
};



const formatAmount = (amount) => {
  if (amount >= 1_000_000_000_000) {
    return (amount / 1_000_000_000_000).toFixed(2) + 'T'; // Trillionen
  } else if (amount >= 1_000_000_000) {
    return (amount / 1_000_000_000).toFixed(2) + 'B'; // Milliarden
  } else if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(2) + 'M'; // Millionen
  } else if (amount >= 1_000) {
    return (amount / 1_000).toFixed(2) + 'K'; // Tausender
  } else if (amount >= 1_000) {
    return (amount / 1_000).toFixed(2) + 'K'; // Tausender
  }
  return amount.toString(); // Weniger als 1.000, einfach als String
};

const formatSimpleAmount = (amount) => {
  if (amount >= 1_000_000_000_000) {
    return Math.floor(amount / 1_000_000_000_000) + 'T+'; // Trillionen
  } else if (amount >= 1_000_000_000) {
    return Math.floor(amount / 1_000_000_000) + 'B+'; // Milliarden
  } else if (amount >= 1_000_000) {
    return Math.floor(amount / 1_000_000) + 'M+'; // Millionen
  } else if (amount >= 1_000) {
    return Math.floor(amount / 1_000) + 'K+'; // Tausender
  } else  {
    return Math.floor(amount / 1) + '+'; // Tausender
  }
};


const TeamsRowName = styled.div<{ color?: string }>`


${({ color }) =>
  color && color.trim() !== ''
    ? `border-left: clamp(0.1em, 1vw, 0.25em) solid ${color};`
    : 'border-left: none;'}

    ${({ color }) =>
      color && color.trim() !== ''
        ? `padding-left: clamp(0.05em, 1vw, 0.5em);`
        : 'padding-left: 0em;'}

  text-transform: uppercase;
  text-align: start;
  font-weight: bold;
  color: rgba(255, 255, 255, 1.0);
  font-size: clamp(1rem, 1vw, 3rem);
  display: flex;
  flex-direction: row;

  
`;

export default AirdropDashboard;
