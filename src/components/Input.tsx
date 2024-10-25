import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { MdContentCopy, MdCheck } from "react-icons/md";


export const Input = styled.input<{ width?: string }>`
  text-align: center;
  margin: 0 10px;
  background: transparent;
  cursor: pointer;
  font-weight: bold;
  text-transform: uppercase;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  color: white;
  max-height: 40px;
  min-width: 40px; /* Minimale Breite */
  max-width: 100%; /* Maximale Breite auf 100% setzen */
  width: ${({ width }) => width || 'auto'}; /* Dynamische Breite basierend auf der Prop */

  padding: 0.4em;
  border: 2px solid white; /* Darker input */
  -moz-appearance: textfield;
  
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    outline: none;
    border-color: blue;
    box-shadow: 0 0 10px blue;
  }

  @media screen and (min-width: 1024px) {
    font-size: 1.4rem;
  }
  @media screen and (min-width: 768px) and (max-width: 1024px) {
    font-size: 1.4rem;
  }
`;

interface InputWrapperProps {
  content: string;
  onClick?: () => void;
}

export const InputWithButton = ({ content, onClick }: InputWrapperProps) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    onClick?.();
    setTimeout(() => setClicked(false), 2000); // Reset after 2 seconds
  };

  return (
    <InputWrapper>
      <input type="url" readOnly={true} id="fname" name="fname" value={content} onChange={() => {}}></input>
      <button type="button" onClick={handleClick}>
        {clicked ? <MdCheck className='icon' /> : <MdContentCopy className='icon' />}
      </button>
    </InputWrapper>
  );
};

const InputWrapper = styled.div`


  margin: 0.5em 0;
  display:flex;
  flex-direction: colum;
  align-items: center; 
  height: 3em;
  border: 2px solid white;
  font-weight: bold;

  min-width: 5em;

  &:hover{
     box-shadow: 0 0 10px #ba1313;
  }


  input {
    flex:1;
    height: 100%;
    padding: 0.5em 0.8em;
    background: transparent;
    border: transparent;
    text-transform: uppercase;
    overflow: hidden;
    text-overflow: ellipsis; 
    white-space: nowrap;
    font-weight:bold;
    font-size: 1rem;
    width: fit-content;
    max-width: 6em;
  }

  input:focus{
    outline: none;
  }

  button {
    background: transparent;
    border: transparent;
    display: flex; 
    flex-direction: row;
    align-items: center;
    justify-content: center; 
    height: 100%; 
    width: 3em; 
  }

  button:hover{
    background: #bb1313;
  }
  button:active {
    background: #003CBC; /* Oder eine andere Farbe für den Press-Effekt */
    transform: scale(0.95); /* Optional: Verkleinert den Button leicht beim Drücken */
  }

  .icon{
    width: 1.5em;
    height: auto;
  }
`;


export const DiscountCodeContainer = styled.div`

  display:flex;
  flex-direction: column;
  justify-content: start;
  gap: 0.5em;
  width:100%;

  .discount-title {
    font-weight: bold;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-shadow: 0 0 10px blue;
    transition: all 0.3s ease;
  }

  @media screen and (min-width: 1024px) {
    .discount-title {
      font-size: 1.2rem;
    }
    
  }
  @media screen and (min-width: 768px) and (max-width: 1024px) {
    .discount-title {
      font-size: 1.2rem;
    }
  }
`;

export const DiscountInput = styled.input`
 
    height: 100%;
    padding: 0.5em 0.8em;
    border: transparent;
    text-transform: uppercase;
    overflow: hidden;
    text-overflow: ellipsis; 
    white-space: nowrap;
    font-weight: bold;
    font-size:1rem;
    min-width:10em;
    width: fit-content;
    background-color:transparent;

    &:focus{
      outline: none;
    }
`;

export const DiscountMessage = styled.p<{ isValid?: boolean }>`
  text-transform: uppercase;
  overflow: hidden;
  color: white;
  font-weight: normal;
  letter-spacing: 1px;
  font-size:1rem;
`;


