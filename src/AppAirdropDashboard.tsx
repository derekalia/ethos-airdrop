import React, { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { config } from './components/config';
import AirdropDashboard from "./routes/AirdropDashboard/AirdropDashboard"



const AppAirdropDashboard: React.FC = (() => {

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS as string;
  const priceInWei = parseInt(import.meta.env.VITE_PRICE_IN_WEI as string);
  const chainId = parseInt(import.meta.env.VITE_CHAIN_ID as string);
  const etherscanDomain = import.meta.env.VITE_ETHERSCAN_DOMAIN as string;
    
  return (
    <>
      <WagmiProvider config={config}>
        <AirdropDashboard
          contractAddress={contractAddress}
          priceInWei={priceInWei}
          chainId={chainId}
          etherscanDomain={etherscanDomain} 
        />
      </WagmiProvider>
    </>
  );
})

export default AppAirdropDashboard;
