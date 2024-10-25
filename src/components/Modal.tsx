// src/components/Modal.tsx
import styled from 'styled-components';
import { Web3Provider } from "../components/Web3Provider";
import { ConnectKitButton } from "connectkit";
import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";
import React, { useRef, useEffect, useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useAccount } from 'wagmi';
import abi from "../json/EthOSNFT.json";
import { config } from './config';
import { switchChain } from '@wagmi/core'
import { ClipLoader } from 'react-spinners';

interface ModalProps {
  show: boolean;
  amount: number;
  price: number;
  chainId: number;
  contract: string;
  affiliate: string | undefined;
  handleClose: () => void;
}

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  background: #000;
  border: 5px solid #0004FF;
  padding: 20px;
  border-radius: 8px;
  max-width: 700px;
  width: 100%;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #0004FF;
  font-size: 1.5rem;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
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
`;

const CenteredConnectButton = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const Modal: React.FC<ModalProps> = ({ show, handleClose, amount, affiliate, price, contract, chainId }) => {
  if (!show) {
    return null;
  }
  const account = useAccount();

  const modalRef = useRef(null);

  const [copyButtonText, setCopyText] = useState("Copy");

  const { data: hash, writeContractAsync } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  useEffect(() => {

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

  }, [show, handleClose]);

  function copyAffiliateLink() {
    console.log("Copying affiliate link...", copyButtonText)
    const affiliateLink = `${window.location.origin}/?affiliate=${account.address}`;
    navigator.clipboard.writeText(affiliateLink);
    setCopyText("Copied!");
    console.log("Copied affiliate link:", copyButtonText)
  }

  async function mint() {
    console.log("Minting NFT...", amount, account.address, affiliate, chainId);
    if (account.chainId !== chainId) {
      await switchChain(config, {chainId: chainId})
    }
    if (affiliate === null || affiliate === undefined || affiliate === "") {
      // Set to "address(0)"
      affiliate = "0x0000000000000000000000000000000000000000"
    }
    writeContractAsync({
      abi,
      address: contract,
      chainId: chainId,
      functionName: "mintPhone",
      args: [amount, account.address, affiliate],
      value: BigInt(price) * BigInt(amount),
    }).catch((error) => {
      console.error('Error:', error)
    })
  }

  return (
    <ModalWrapper>
      <ModalContent ref={modalRef}>
        <CloseButton onClick={handleClose}>×</CloseButton>
        <h2>Connect Wallet or Buy with Credit Card</h2>
        {isConfirming ? (
          <div style={{ textAlign: 'center' }}>
            <ClipLoader size={50} color={"#0004FF"} />
            <p>Completing transaction</p>
          </div>
        ) : isConfirmed ? (
          <div style={{ textAlign: 'center' }}>
            <p>Thank you for minting the dgen1</p>
            <p>Here is your affiliate link:</p>
            <CenteredConnectButton>
              <ModalButton onClick={copyAffiliateLink}>{copyButtonText}</ModalButton>
            </CenteredConnectButton>
          </div>
        ) : (
          <>
            {account.isConnected ? (
              <CenteredConnectButton>
                <ModalButton onClick={mint}>Mint using Wallet</ModalButton>
              </CenteredConnectButton>
            ) : (
              <Web3Provider>
                <ConnectKitButton.Custom>
                  {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
                    return (
                      <CenteredConnectButton>
                        <ModalButton onClick={show}>Connect Wallet</ModalButton>
                      </CenteredConnectButton>
                    );
                  }}
                </ConnectKitButton.Custom>
              </Web3Provider>
            )}

            <CrossmintPayButton
              style={{
                padding: "15px 30px",
                marginTop: "15px",
                marginLeft: "auto",
                marginRight: "auto",
                borderRadius: "5px",
                textAlign: "center",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.3s",
                display: "block"
              }}
              collectionId="4a1e10ac-070d-48db-a974-cbc1e2c783cb"
              projectId="2db51e4c-4152-4953-9793-c1dbdeecbfef"
              mintConfig={{ "totalPrice": "0.000000000000000022", "amount": amount.toFixed(2).toString(), "affiliate": affiliate }}
              environment="staging"
              checkoutProps={{ "paymentMethods": ["fiat", "ETH", "SOL"] }}
            />
          </>
        )}
      </ModalContent>
    </ModalWrapper>
  );
};

export default Modal;
