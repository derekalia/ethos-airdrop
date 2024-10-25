import React, { useEffect } from 'react';
import ProductPage from './components/ProductPage';
import BuyProduct from './routes/BuyPage/BuyProduct';
import ThankYouMinted from './routes/ThankYouMinted/ThankYouMinted';
import { WagmiProvider, useContractRead } from 'wagmi';
import { config } from './components/config';
import { useSearchParams } from 'react-router-dom';
import { Web3Provider } from "./components/Web3Provider";


interface AppProps {
  hasMinted: boolean;
}

const App: React.FC<AppProps> = ({ hasMinted }: AppProps) => {
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS as string;
  const chainId = parseInt(import.meta.env.VITE_CHAIN_ID as string);
  const etherscanDomain = import.meta.env.VITE_ETHERSCAN_DOMAIN as string;
  const degenAddress = import.meta.env.VITE_DEGEN_ADDRESS as string;

  const [searchParams] = useSearchParams();
  const affiliate = searchParams.get('affiliate');

  // Log environment variables to ensure they're loaded correctly
  useEffect(() => {
    console.log({ contractAddress, chainId, etherscanDomain, degenAddress });
  }, [contractAddress, chainId, etherscanDomain, degenAddress]);

  return (
    <WagmiProvider config={config}>
      <PriceFetcher
        contractAddress={contractAddress}
        chainId={chainId}
        affiliate={affiliate}
        etherscanDomain={etherscanDomain}
        degenAddress={degenAddress}
        hasMinted={hasMinted}
      />
    </WagmiProvider>
  );
};

interface PriceFetcherProps extends AppProps {
  contractAddress: string;
  chainId: number;
  affiliate: string | null;
  etherscanDomain: string;
  degenAddress: string;
}

const PriceFetcher: React.FC<PriceFetcherProps> = ({
  contractAddress,
  chainId,
  affiliate,
  etherscanDomain,
  degenAddress,
  hasMinted,
}) => {
  // Define the correct structured ABI for the contract functions
  const ethPriceAbi = [
    {
      "constant": true,
      "inputs": [],
      "name": "ethPrice",
      "outputs": [{ "name": "", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
    },
  ];

  const degenPriceAbi = [
    {
      "constant": true,
      "inputs": [],
      "name": "degenPrice",
      "outputs": [{ "name": "", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
    },
  ];

  // Fetch ethPrice from the contract
  const { data: priceInWei } = useContractRead({
    address: contractAddress,
    abi: ethPriceAbi,
    functionName: 'ethPrice',
    chainId: chainId,
  });

  // Fetch degenPrice from the contract
  const { data: degenPrice } = useContractRead({
    address: contractAddress,
    abi: degenPriceAbi,
    functionName: 'degenPrice',
    chainId: chainId,
  });

  useEffect(() => {
    console.log("degenPrice", degenPrice)
  }, [degenPrice]);


  // Convert BigInt to string for display
  const priceInWeiString = priceInWei ? Number(priceInWei) : -1;
  const degenPriceString = degenPrice ? Number(degenPrice) : -1;

  // Display the appropriate page based on minting status
  if (!hasMinted) {
    return (
      <>
        <Web3Provider>
          <BuyProduct
            contractAddress={contractAddress}
            priceInWei={priceInWeiString}
            chainId={chainId}
            etherscanDomain={etherscanDomain}
            degenPrice={degenPriceString}
            degenAddress={degenAddress}
          />
        </Web3Provider>
      </>
    );
  } else {
    return (
      <>
        <ThankYouMinted
          contractAddress={contractAddress}
          etherscanDomain={etherscanDomain}
        />
      </>
    );
  }
};

export default App;
