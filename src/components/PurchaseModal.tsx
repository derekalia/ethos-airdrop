import React, { useEffect, useState } from 'react';
import { CrossmintEvent, CrossmintPaymentElement } from "@crossmint/client-sdk-react-ui";
import "./PurchaseModal.css";
import image from "../images/dGEN1 NFT.gif"; 
import IconButton from './IconButton';
import ImageBox from './ImageBox';
import { Web3Provider } from "./Web3Provider";
import { ConnectKitButton } from "connectkit";
import { RiAddFill, RiSubtractFill, RiCloseLargeFill } from "react-icons/ri";
import {Input} from './Input';
import styled, { css } from 'styled-components';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import abi from "../json/EthOSNFT.json";
import erc20Abi from '../json/ERC20TokenAbi.json'; // Import the ERC20 ABI for approval

interface PurchaseModalProps {
  projectId: string;
  contractAddress: string;
  priceInWei: number;
  affiliate: string;
  collectionId: string;
  environment: string;
  degenPrice: number;
  degenAddress: string;
  onClose: () => void;
}

export function PurchaseModal({ projectId, contractAddress, priceInWei, affiliate, collectionId, environment, degenPrice, degenAddress, onClose }: PurchaseModalProps) {
  const [amount, setAmount] = useState(1); // State for the counter
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card'>('crypto'); // Track payment method selection
  const [isMinting, setIsMinting] = useState(false); // State for minting
  const [isMintButtonEnabled, setIsMintButtonEnabled] = useState(true); // State for minting
  const [crossmintEvent, setCrossmintEvent] = useState<CrossmintEvent | null>(null);
  const [showCryptoOptions, setShowCryptoOptions] = useState(false); // New state for showing crypto options
  const [loading, setLoading] = useState(false); // New state for loading spinner
  const [loadingMessage, setLoadingMessage] = useState(""); // New state for the loading message

  const account = useAccount();

  // Add write contract hooks for the ERC20 token approval
  const { data: approvalHash, writeContractAsync: approveDEGEN } = useWriteContract();
  const { writeContractAsync: mintPhoneUsingDegen, data: mintHash } = useWriteContract({
    abi,
    address: contractAddress, // EthOSNFT contract address
    functionName: 'mintPhoneUsingDegen',
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: approvalHash,
    onSuccess: () => {
      console.log('Approval successful');
      setLoadingMessage("DEGEN Approved, ready to mint.");
    },
  });

  const { isLoading: isMintingTransaction, isSuccess: isMinted } = useWaitForTransactionReceipt({
    hash: mintHash,
    onSuccess: () => {
      setLoadingMessage("Minting complete!");

      window.location.href = '/minted'; // Redirect or perform further actions
    },
  });

  useEffect(() => {
    if (isMintingTransaction) {
      setLoadingMessage("Confirming DEGEN purchase.");
      setIsMinting(true);
    }
  }, [isMintingTransaction]);

  useEffect(() => {
    if (isMinted) {
      setLoadingMessage("Confirmed!");
      window.location.href = '/minted';
    }
  }, [isMinted]);

  useEffect(() => {
    if (isConfirming) {
      setLoadingMessage("Confirming DEGEN approval.");
    }
  }, [isConfirming]);

  useEffect(() => {
    if (isConfirmed) {
      setLoadingMessage("Please confirm purchase in wallet");
      mintWithDEGEN(); // Call the mint function after approval is confirmed
    }
  }, [isConfirmed]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 1 : Math.max(1, parseInt(e.target.value, 10)); // Ensure value is a number
    setAmount(value);
  };

  useEffect(() => {
    console.log(JSON.stringify(crossmintEvent));
    if (crossmintEvent != null) {
      if (crossmintEvent.type === "payment:process.started") {
        setIsMinting(true);
      }
      if (crossmintEvent.type === "payment:process.succeeded") {
        setIsMinting(false);
        window.location.href = '/minted';
      }
    }
  }, [crossmintEvent]);

  const payWithDEGENClicked = async () => {
    setLoading(true); // Start loading when button is clicked
    setLoadingMessage("Please approve DEGEN in wallet"); // Set message
    console.log("DEGEN is: ", degenAddress);

    if (account.isConnected) {
      try {
        // Approve the DEGEN token amount for the contract
        await approveDEGEN({
          abi: erc20Abi,
          address: degenAddress, // DEGEN token contract address
          functionName: 'approve',
          args: [contractAddress, degenPrice*amount], // The contract to approve spending tokens, and the amount to approve
        });
      } catch (error) {
        console.error('Approval error:', error);
        setLoadingMessage("Approval failed. Try again.");
      }
    }
  };

  const mintWithDEGEN = async () => {
    setLoading(true);
    setLoadingMessage("Minting dGEN1 with DEGEN...");

    try {
      await mintPhoneUsingDegen({
        abi: abi,
        args: [amount, account.address], // amount is 1, beneficiary is the sender (account.address)
        functionName: 'mintPhoneUsingDegen',
        address: contractAddress
      });
    } catch (error) {
      console.error('Minting error:', error);
      setLoadingMessage("Minting failed. Try again.");
    }
  };

  const payWithDaimoClicked = async () => {
    setLoading(true); // Start loading when button is clicked
    setLoadingMessage("Processing payment with crypto..."); // Set message
    await fetchPurchaseUrl();
  };

  const fetchPurchaseUrl = async () => {
    console.log("PRESSED", account.isConnected);
    if (account.isConnected) {
      setIsMintButtonEnabled(false);
      try {
        const hostname = window.location.hostname; // Get the current hostname
        const response = await fetch(`https://getdaimourl-7gv6yodekq-uc.a.run.app?hostname=${hostname}`);
        const data = await response.json();
        console.log(data);
        if (data.url) {
          window.open(data.url, '_blank'); // Open url in new tab
        }
      } catch (error) {
        console.error("Error in async function", error);
      } finally {
        setIsMintButtonEnabled(true); // Re-enable the button after the fetch
      }
    }
  };

  function multiplyAndFormat(baseStr: string, multiplier: number) {
    const baseNumber = parseFloat(baseStr);
    const transformedBaseNumber = baseNumber / Math.pow(10, 18);
    const result = transformedBaseNumber * multiplier;
    const decimalPlaces = 18;
    return result.toFixed(decimalPlaces);
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Left side: Product Info */}
        <div className='modal-header'>
          <h1 className="modal-title">Purchase</h1>
          <IconButton onClick={onClose}>
            <RiCloseLargeFill className='modal-icon' />
          </IconButton>
        </div>
        
        <div className='modal-content-wrapper'>
          <div className="left-side">
            <ImageBox text={"Minting..."} loading={isMinting}>
              <img src={image} alt="Graphic Animation" />
            </ImageBox>
          </div>

          {/* Right side: Payment options */}
          <div className="right-side">
            {showCryptoOptions ? (
              <div className="crypto-options">
                {loading ? (
                  <div className="spinner-wrapper">
                    <Spinner />
                    <LoadingText>{loadingMessage}</LoadingText>
                  </div>
                ) : (
                  <>
                    <PurchaseButton onClick={payWithDaimoClicked}>Pay with any crypto</PurchaseButton>
                    <PurchaseButton onClick={payWithDEGENClicked}>Pay with DEGEN</PurchaseButton>
                  </>
                )}
              </div>
            ) : paymentMethod === 'card' ? (
              <div className="crossmint-payment-element-wrapper">
                <CrossmintPaymentElement
                  uiConfig={{
                    colors: {
                      background: "#060606",
                      textPrimary: "#f1f1f1",
                      textSecondary: "rgba(255, 255, 255, 0.6)",
                      accent: "blue",
                      backgroundSecondary: "#1f1f1f",
                      border: "none",
                      danger: "#ff4d4f",
                      textLink: "#1e90ff"
                    },
                  }}
                  onEvent={(event) => {
                    setCrossmintEvent(event);
                  }}
                  projectId={projectId}
                  collectionId={collectionId}
                  environment={environment}
                  cardWalletPaymentMethods={["apple-pay", "google-pay"]}
                  paymentMethod="fiat"
                  emailInputOptions={{
                    show: true,
                  }}
                  mintConfig={{
                    totalPrice: multiplyAndFormat(priceInWei.toString(), amount),
                    amount: amount.toString(),
                    affiliate: affiliate || "0x0000000000000000000000000000000000000000",
                  }}
                />
              </div>
            ) : (
              <>
                <div className='purchase-body'>
                  <h3 className='purchase-subtitle'>ethOS: dGEN1</h3>

                  <div className="purchase-items">
                    <div className="purchase-item">
                      <h5 className="purchase-title">//STATUS</h5>
                      <p className="purchase-desc">LIVE</p>
                    </div>

                    <div className="purchase-item">
                      <h5 className="purchase-title">//PRICE</h5>
                      <p className="purchase-desc">{(priceInWei / 1e18).toFixed(2)} ETH or</p>
                      <p className="purchase-desc">{(degenPrice / 1e18).toFixed(2)} DEGEN</p>
                    </div>
                  </div>
                </div>
              
                {/* Quantity Selector */}
                <div className="quantity-wrapper">
                  <IconButton onClick={() => setAmount(amount - 1)} disabled={amount <= 1}>
                    <RiSubtractFill className='quantity-icon'/>
                  </IconButton>

                  <Input
                    type="number"
                    value={amount}
                    onChange={handleQuantityChange}
                    min="1"
                  />

                  <IconButton onClick={() => setAmount(amount + 1)}>
                    <RiAddFill className='quantity-icon'/>
                  </IconButton>
                </div>
              </>
            )}

            {/* Payment Method Selection */}
            {!showCryptoOptions && paymentMethod !== 'card' && (
              <div className="payment-methods">
                {account.isConnected ? (
                  <>
                    <PurchaseButton
                      onClick={() => setShowCryptoOptions(true)} // Show the crypto options instead of redirecting
                      disabled={!isMintButtonEnabled}
                      secondary={true}
                    >
                      Wallet
                    </PurchaseButton>
                    <PurchaseButton onClick={() => setPaymentMethod('card')}>Credit Card</PurchaseButton>
                  </>
                ) : (
                  <>
                    <Web3Provider>
                      <ConnectKitButton.Custom>
                        {({ show, isConnected }) => (
                          <PurchaseButton
                            disabled={!isMintButtonEnabled}
                            onClick={() => {
                              if (isConnected) {
                                setShowCryptoOptions(true); // Show crypto options if connected
                              } else {
                                show(); // Trigger wallet connection
                              }
                            }}
                            secondary={true}
                          >
                            Wallet
                          </PurchaseButton>
                        )}
                      </ConnectKitButton.Custom>
                    </Web3Provider>
                    <PurchaseButton onClick={() => setPaymentMethod('card')}>Credit Card</PurchaseButton>
                  </>
                )}
              </div>            
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface PurchaseButtonProps {
  children: React.ReactNode;
  onClick?: () => void; // optional onClick handler
  secondary?: boolean;
  border?:boolean;
}

export const PurchaseButton = styled.button<PurchaseButtonProps>`
  padding: 0.5em 1.8em;
  font-weight: bold;
  text-transform: uppercase;
  border: 2px solid;
  cursor: pointer;
  box-shadow: 0 0 10px blue;
  transition: all 0.3s ease;
  font-size: 1.2em;
  border-radius: 0px;
  white-space: nowrap; /* Prevents text wrapping */
  word-break: keep-all; /* Ensures the text doesn't break unnecessarily */
  
  ${props => props.secondary ? css`
    background: blue;
    color: white;
    
    border-color: ${props.border ? 'white' : 'blue'}; // Hier wird die border-Abfrage verwendet

    &:hover {
      box-shadow: 0 0 10px blue;
      background: #003CBC;
    }
  ` : css`
    background: white;
    color: blue;
    border-color: white;

    &:hover {
      box-shadow: 0 0 10px blue;
      background: #AAAAAA;
    }
  `}
`;

/* Add simple CSS-based spinner */
export const Spinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.9);
  border-top: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 2em;
  height: 2em;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

/* Loading text style */
export const LoadingText = styled.p`
  font-size: 1rem;
  color: #f1f1f1;
  text-align: center;
  text-transform: uppercase;
`;

export const FadeInOut = styled.div`

  padding: 1.5em 0;
  display: flex;
  flex-direction: row;
  align-items:center;
  gap:1em;
  animation: fade 2s infinite; // Dauer und Wiederholung der Animation
  
  @keyframes fade {
    0%, 100% {
      opacity: 0; // Anfangs- und Endzustand
    }
    50% {
      opacity: 1; // Maximale Deckkraft zur Mitte der Animation
    }
  }
`;
