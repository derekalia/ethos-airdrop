import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import productImage from '../images/240513_FRONT_ANGLE_TRNS.png';
import { Web3Provider } from "./Web3Provider";
import { ConnectKitButton } from "connectkit";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useContractRead } from 'wagmi';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Table from './Table';
import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";
import abi from "../json/EthOSNFT.json";
import { config } from './config';
import { switchChain } from '@wagmi/core';
import { MoonLoader } from 'react-spinners';
import { ethers } from 'ethers';

// Global styles to ensure the background covers the entire screen and the font is correctly applied
const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    background-color: #000;
    color: #0004FF;
   
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }
`;
const StyledCrossmintPayButton = styled(CrossmintPayButton).attrs({
  className: 'modal-button', // Assign the same class as your "Connect Wallet" button
})`
  padding: 10px 20px;
  font-size: 1rem;
  color: #000;
  background-color: #0004FF;
  border: none;
  cursor: pointer;
  margin: 10px;
  transition: background-color 0.3s;
  text-align: center;

  &:hover {
    background-color: #ff4d4d;
  }

  &:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 5px 10px;
    font-size: 0.8rem;
    margin: 5px;
  }
`;



const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  background-color: #000;
  color: #0004FF;
  min-height: 100vh;
  position: relative;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 10px;
    flex-direction: column;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ImageWrapper = styled.div`
  margin-bottom: 20px;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  display: block;

  @media (max-width: 768px) {
    max-width: 300px;
  }
`;

const HeroSection = styled.section`
  width: 100%;
  max-width: 600px;
  padding: 20px;
  background: #000;
  color: #0004FF;
  border-radius: 10px;
  border: 2px solid #0004FF;
  box-sizing: border-box;
  margin-top: -80px;
  position: relative;
  z-index: 0;

  @media (max-width: 768px) {
    padding: 10px;
    margin-top: -40px;
  }
`;

const Heading = styled.h2`
  font-size: 1.2rem;
  margin: 20px 0;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin: 10px 0;
  }
`;

const InfoWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 10px 40px;
  margin: 20px 0;
  justify-content: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 768px) {
    justify-content: space-between;
    margin: 5px 0;
  }
`;

const InfoTitle = styled.span`
  font-size: 0.8rem;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const InfoValue = styled.span`
  font-size: 0.8rem;
  margin-left: 10px;
  color: #f0e68c;
  text-align: right;
  max-width: 150px; // Set a fixed width
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 0.7rem;
    margin-left: 5px;
  }
`;

const QuantityWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;

  @media (max-width: 768px) {
    margin: 10px 0;
  }
`;

const QuantityButton = styled.button`
  padding: 5px 10px;
  font-size: 1rem;
  color: ${props => (props.disabled ? '#666' : '#0004FF')};
  background-color: ${props => (props.disabled ? '#000' : '#000')};
  border: 1px solid #0004FF;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: ${props => (props.disabled ? '#000' : '#0004FF')};
    color: ${props => (props.disabled ? '#666' : '#000')};
  }

  @media (max-width: 768px) {
    padding: 5px;
    font-size: 0.8rem;
  }
`;

const QuantityInput = styled.input`
  width: 50px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  color: #0004FF;
  background-color: #000;
  border: 1px solid #0004FF;
  margin: 0 10px;
  text-align: center;
  font-family: 'Press Start 2P', cursive; // Retain the font
  -moz-appearance: textfield; // Remove spinner in Firefox

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none; // Remove spinner in WebKit browsers
    margin: 0;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 30px;
    font-size: 0.8rem;
    margin: 0 5px;
  }
`;

const MintButton = styled.button`
  padding: 10px 20px;
  font-size: 0.9rem;
  color: #000;
  background-color: #0004FF;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: 'Press Start 2P', cursive;

  &:hover {
    background-color: #ff4d4d;
  }

  &:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 5px 10px;
    font-size: 0.8rem;
  }
`;

const Footer = styled.div`
  margin-top: auto;
  padding: 10px 0;
  font-size: 0.8rem;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  color: #000;
  background-color: #0004FF;
  border: none;
  cursor: pointer;
  margin: 10px;
  transition: background-color 0.3s;
  font-family: 'Press Start 2P', cursive;

  &:hover {
    background-color: #ff4d4d;
  }

  @media (max-width: 768px) {
    padding: 5px 10px;
    font-size: 0.8rem;
    margin: 5px;
  }
`;

const CenteredConnectButton = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;

  @media (max-width: 768px) {
    margin: 10px 0;
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;

    th, td {
      border: 1px solid #0004FF;
      padding: 8px;
      text-align: left;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    th {
      background-color: #000;
      color: #0004FF;
    }

    td {
      background-color: #111;
      color: #fff;
    }
  }

  @media (max-width: 768px) {
    table {
      th, td {
        font-size: 0.8rem;
        padding: 4px;
      }
    }
  }
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

// Define the new section styled component
const NewSection = styled.section`
  width: 100%;
  max-width: 600px;
  padding: 20px;
  background: #000;
  color: #0004FF;
  border-radius: 10px;
  border: 2px solid #0004FF;
  box-sizing: border-box;
  margin-top: 20px;  // Spacing between HeroSection and NewSection
  margin-bottom: 20px;  // Spacing between NewSection and Table
  position: relative;
  z-index: 0;

  @media (max-width: 768px) {
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
`;

const client = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/16024/newest-test/version/latest', // Replace with your GraphQL endpoint
  cache: new InMemoryCache(),
});

interface ProductPageProps {
  contractAddress: string;
  priceInWei: number;
  chainId: number;
  etherscanDomain: string;
}

const getQueryParam = (param: string) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

const ProductPage: React.FC<ProductPageProps> = ({ contractAddress, priceInWei, chainId, etherscanDomain }) => {
  const account = useAccount();
  const [amount, setAmount] = useState(1);
  const [affiliate, setAffiliate] = useState<string | undefined>(undefined);
  const [isCreditCardConfirmed, setIsCreditCardConfirmed] = useState(false);
  const [creditCardAffiliate, setCreditCardAffiliate] = useState<string | undefined>(undefined);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showAffiliateLink, setShowAffiliateLink] = useState(false);

  const { data: hash, writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
    onSuccess: () => {
      console.log("Transaction successful, showing thank you message.");
      setShowThankYou(true);
    },
  });

  function multiplyAndFormat(baseStr: string, multiplier: number) {
    const baseNumber = parseFloat(baseStr);
    const transformedBaseNumber = baseNumber / Math.pow(10, 18);
    const result = transformedBaseNumber * multiplier;
    const decimalPlaces = 18;
    return result.toFixed(decimalPlaces);
  }

  const { data: nftBalanceData } = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: 'balanceOf',
    args: [account.address],
    watch: true,
    enabled: account.isConnected,
  });

  const { data: rewardAvailable } = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: 'getRewardAmount',
    args: [account.address],
    watch: true,
    enabled: account.isConnected,
  });

  const { data: rewardOpen } = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: 'rewardOpen',
    args: [],
    watch: true,
    enabled: account.isConnected,
  });


  useEffect(() => {
    if (nftBalanceData) {
      console.log("NFT balance:", nftBalanceData);
      if (nftBalanceData > 0) {
        setShowAffiliateLink(true);
      }
    }
  }, [nftBalanceData]);

  useEffect(() => {
    try {
      const affiliateParam = getQueryParam('affiliate');
      console.log('affiliateParam', affiliateParam);
      setAffiliate(affiliateParam || undefined);
      getMaybeEnsName(affiliateParam || undefined).then((resolved) => {
        setAffiliate(resolved?.toString() || "0x0000000000000000000000000000000000000000");
      });
    } catch (error) {
      console.error('error', error);
    }
  }, []);

  useEffect(() => {
    if (isConfirmed) {
      console.log("Transaction confirmed, updating NFT balance.");
      setShowThankYou(true);
      setShowAffiliateLink(true);
    }
  }, [isConfirmed]);

  useEffect(() => {
    console.log("Reward available:", rewardAvailable);
  }, [rewardOpen]);

  useEffect(() => {
    const pParam = getQueryParam('p');
    if (pParam) {
      setIsCreditCardConfirmed(true);
      const decoded = decodeURIComponent(pParam);
      const parsed = JSON.parse(decoded);
      const walletAddress = parsed[0]?.walletAddress;
      setCreditCardAffiliate(walletAddress);
      setShowThankYou(true);
      setShowAffiliateLink(true);
    }
  }, []);

  const mint = async () => {
    console.log("Minting NFT...", amount, account.address, affiliate, chainId);
    if (account.chainId !== chainId) {
      await switchChain(config, { chainId: chainId });
    }
    const adjustedAffiliate = await getMaybeEnsName(affiliate);
    writeContractAsync({
      abi,
      address: contractAddress,
      chainId: chainId,
      functionName: "mintPhone",
      args: [amount, account.address, adjustedAffiliate],
      value: BigInt(priceInWei) * BigInt(amount),
    }).catch((error) => {
      console.error('Error:', error);
    });
  };

  const copyAffiliateLink = (affiliateAddress: string) => {
    const affiliateLink = `${window.location.origin}/?affiliate=${affiliateAddress}`;
    navigator.clipboard.writeText(affiliateLink);
    setCopyText("Copied!");
    console.log("Copied affiliate link");
  };

  function openAddress(address: string) {
    window.open(`https://${etherscanDomain}/address/${address}`, '_blank');
  }

  const [copyButtonText, setCopyText] = useState("Copy");

  const [displayName, setDisplayName] = useState('');

  const newProvider = new ethers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/7VRG5CtXPdmq6p65GXf2uz6g_8Xb2oPz');

  useEffect(() => {
    const fetchEnsName = async () => {
      if (account.address) {
        setDisplayName(account.address);
        const name = await getEnsName(account.address);
        setDisplayName(name);
      }
    };

    fetchEnsName();
  }, [account.address]);

  
  async function getEnsName(address: string) {
    var name = await newProvider.lookupAddress(address);
    if (name === null) {
      name = address;
    }
    return name;
  }

  async function getMaybeEnsName(affiliate: string | undefined) {
    if (affiliate === undefined) {
      return "0x0000000000000000000000000000000000000000";
    }
    if (ethers.isAddress(affiliate)) {
      return affiliate;
    }
    const resolvedAddress = await newProvider.resolveName(affiliate);
    return resolvedAddress;
  }


  async function claimRewards() {
    console.log("Claiming rewards...");
    writeContractAsync({
      abi,
      address: contractAddress,
      chainId: chainId,
      functionName: "withdrawAffiliate",
      args: [],
    }).catch((error) => {
      console.error('Error:', error);
    });
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10));
    setAmount(value);
  };

  const isMintButtonDisabled = amount === '' || amount <= 0;

  return (
    <>
      <GlobalStyle />
      <PageWrapper>
        <Header>
          <Title>ethOS</Title>
        </Header>
        <ImageWrapper>
          <ProductImage src={productImage} alt="Product" />
        </ImageWrapper>
        <HeroSection>
          <Heading>ethOS dGEN1 mint</Heading>
          <InfoWrapper>
            <InfoItem>
              <InfoTitle>contract:</InfoTitle>
              <InfoValue onClick={() => openAddress(contractAddress)} >{contractAddress}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoTitle>chain:</InfoTitle>
              <InfoValue>Base</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoTitle>mechanism:</InfoTitle>
              <InfoValue>mint</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoTitle>price:</InfoTitle>
              <InfoValue>{(priceInWei / 1e18).toFixed(2)} ETH</InfoValue>
            </InfoItem>
            <InfoItem>
              <Web3Provider>
                <InfoTitle>your wallet:</InfoTitle>
                {account.isConnected ? (
                  <InfoValue onClick={() => openAddress(account.address)}>{displayName}</InfoValue>
                ) : (
                  <InfoValue>Not connected</InfoValue>
                )}
              </Web3Provider>
            </InfoItem>
          </InfoWrapper>
          <QuantityWrapper>
            <QuantityButton onClick={() => setAmount(amount - 1)} disabled={amount <= 1}>-</QuantityButton>
            <QuantityInput type="number" value={amount} onChange={handleQuantityChange} min="1" />
            <QuantityButton onClick={() => setAmount(amount + 1)}>+</QuantityButton>
          </QuantityWrapper>
          {!isCreditCardConfirmed && !account.isConnected && (
            <Web3Provider>
              <ConnectKitButton.Custom>
                {({ show }) => (
                  <CenteredConnectButton>
                    <ModalButton onClick={show}>Connect Wallet</ModalButton>
                  </CenteredConnectButton>
                )}
              </ConnectKitButton.Custom>
            </Web3Provider>
          )}
          {!isCreditCardConfirmed && !account.isConnected && !isConfirming && !isConfirmed && (
            <CenteredConnectButton>
              <CrossmintPayButton
                style={{
                  padding: '10px 20px',
                  fontSize: '1rem',
                  color: '#000',
                  backgroundColor: '#0004FF',
                  border: 'none',
                  cursor: isMintButtonDisabled ? 'not-allowed' : 'pointer', // Update cursor style
                  margin: '10px',
                  transition: 'background-color 0.3s',
                  fontFamily: "'Press Start 2P', cursive",
                  textAlign: 'center',
                  opacity: isMintButtonDisabled ? 0.5 : 1, // Update opacity when disabled
                }}
                theme="light"
                collectionId="4a1e10ac-070d-48db-a974-cbc1e2c783cb"
                projectId="2db51e4c-4152-4953-9793-c1dbdeecbfef"
                mintConfig={{
                  "totalPrice": multiplyAndFormat(priceInWei.toString(), amount === '' ? 1 : amount),
                  "amount": (amount === '' ? 1 : amount).toString(),
                  "affiliate": affiliate || "0x0000000000000000000000000000000000000000"
                }}
                environment="staging"
                checkoutProps={{
                  paymentMethods: ["fiat", "ETH", "SOL"],
                  display: "same-tab",
                  experimental: true
                }}
                successCallbackURL={`${window.location.origin}`}
                getButtonText={(connecting, paymentMethod) =>
                  connecting ? "Connecting..." : "Buy with Credit Card"
                }
                disabled={isMintButtonDisabled} // Disable the button when the input is empty
              />
            </CenteredConnectButton>
          )}
          {account.isConnected && !isCreditCardConfirmed && !showThankYou && (
            <>
              <div style={{ marginTop: '20px' }}>
                {!isConfirming && !isConfirmed && (
                  <MintButton onClick={mint} disabled={isMintButtonDisabled}>
                    mint for {((priceInWei / 1e18) * (amount === '' ? 1 : amount)).toFixed(2)} ETH
                  </MintButton>
                )}
              </div>
            </>
          )}
          {isConfirming && (
            <LoaderWrapper>
              <MoonLoader size={50} color={"#0004FF"} />
              <p>Completing transaction</p>
            </LoaderWrapper>
          )}
          {showThankYou && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <p>Thank you for minting the dgen1!</p>
            </div>
          )}
          {showAffiliateLink && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <p>Here is your affiliate link:</p>
              <CenteredConnectButton>
                <ModalButton onClick={() => copyAffiliateLink(account.isConnected ? account.address : creditCardAffiliate!)}>{copyButtonText}</ModalButton>
              </CenteredConnectButton>
            </div>
          )}
        </HeroSection>

        {/* Conditionally render the new section */}
        {rewardAvailable > 0 && !rewardOpen && (
          <NewSection>
            <Heading>Claim your affiliate rewards!</Heading>
            <MintButton onClick={claimRewards}>
              Claim {(Number(rewardAvailable) / (1e18)).toFixed(2)} eth
            </MintButton>
          </NewSection>
        )}
        <ApolloProvider client={client}>
          <TableWrapper>
            <Table etherscanDomain={etherscanDomain} priceInWei={priceInWei} connectedAccount={account.address} />
          </TableWrapper>
        </ApolloProvider>
        <Footer>by Freedom Factory</Footer>
      </PageWrapper>
    </>
  );
};

export default ProductPage;
