import React from 'react';
import styled, { css } from 'styled-components';

interface ImageBoxProps {
    children: React.ReactNode;
    text: string;
    onClick?: () => void; // optional onClick handler
    loading?: boolean;
    minted?: boolean;

  }

const ImageBox = ({ children, onClick, text, loading = false, minted = false }: ImageBoxProps) => {
  return(
    <ImageBoxComponent onClick={onClick} loading={loading} minted={minted}>
      <div className='image-container'>
        <div className='border-overlay'></div>
            
      {loading && (
          <>
            <div className='image-overlay'>
              <p className='image-overlay-text'>{text}</p>
            </div>
          </>
        )}
        
        {children}
      </div>
    </ImageBoxComponent>
  );
}

const ImageBoxComponent = styled.div<{ loading: boolean; minted: boolean }>`
  
    width:100%;
    display:flex;
    justify-content: flex-start; // Änderung hier
    align-items: center;
    margin: 1.5em 0;


    .image-container {
      position: relative;
      width: 50%; // Zurück zu 50% der Breite des übergeordneten Elements
      padding-bottom: 50%; // Macht den Container quadratisch bei 50% Breite
      margin: 0 auto;
      overflow: hidden; // Hinzugefügt, um überlaufende Bilder zu verbergen
        box-shadow: 0 0 10px blue
    }

    .border-overlay {
      border: 2px solid blue;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 3;
    }

    .image-overlay {
      border: 2px solid blue;
      background-color:rgba(0, 0, 0, 0.75);
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2;
      animation: pulse 2s infinite ease-in-out;
    }

  @keyframes pulse {
    0% {
      opacity: 1.0;
    }
    50% {
      opacity: 0.45;
    }
    100% {
      opacity: 1.0;
    }
  }

    .image-overlay-text{
        background-color: blue;
        color: white;
        padding: 10%;
        font-weight:bold;
        text-transform: uppercase;
        font-size: 1rem;
    }

    img {
      position: absolute; // Ändert von relative auf absolute
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 1;
    }

    @media screen and (min-width: 1024px) {
        justify-content: flex-start; // Änderung hier
        align-items: flex-start;
        margin: 0 0;
        
        .image-container {
            width: 100%;
            padding-bottom: 100%;
        }
    }

    @media screen and (min-width: 768px) and (max-width: 1023px) {
        justify-content: flex-start; // Änderung hier
        align-items: flex-start;
        margin: 0 0;
        
        .image-container {
            width: 100%;
            padding-bottom: 100%;
        }
    }

`;

export default ImageBox;
