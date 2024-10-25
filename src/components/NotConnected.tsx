import React from 'react';
import styled from 'styled-components';
import { Web3Provider } from "../components/Web3Provider";
import { ConnectKitButton } from "connectkit";

const NotConnectedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #000;
  color: #0004FF;
  
`;

const Message = styled.h1`
  font-size: 1.5rem;
  margin: 20px;
  text-align: center;
`;

const CenteredConnectButton = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;

  @media (max-width: 768px) {
    margin: 10px 0;
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

const NotConnectedPage = () => (
  <NotConnectedWrapper>
    <Message>Please connect your wallet to access this page.</Message>
    <Web3Provider>
      <ConnectKitButton.Custom>
        {({ show }) => (
          <CenteredConnectButton>
            <ModalButton onClick={show}>Connect Wallet</ModalButton>
          </CenteredConnectButton>
        )}
      </ConnectKitButton.Custom>
    </Web3Provider>
  </NotConnectedWrapper>
);

export default NotConnectedPage;
