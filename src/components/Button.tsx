import React from 'react';
import styled, { css } from 'styled-components';


interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void; // optional onClick handler
    primary?: boolean;
    horPadding?: string;
    verPadding?: string;
}


const Button = ({ children, onClick, primary = false, horPadding = "1.8em", verPadding = "0.5em"}: ButtonProps) => {
  return <StyledButton onClick={onClick} primary={primary} horPadding = {horPadding} verPadding = {verPadding}>{children}</StyledButton>;
};

const StyledButton = styled.button<ButtonProps>`
  display: flex; 
  justify-content: center;
  align-items: center;
  padding: ${props => props.verPadding} ${props => props.horPadding};
  font-weight: bold;
  text-transform: uppercase;
  border: 2px solid;
  cursor: pointer;
  box-shadow: 0 0 10px blue;
  transition: all 0.3s ease;
  font-size: 1.1em;
  border-radius: 0px;
  

  ${props => props.primary ? css`
    background: blue;
    color: white;
    border-color: white;


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

  @media screen and (min-width: 1024px) {
    font-size: 1.2rem;
  }
  @media screen and (min-width: 768px) and (max-width: 1024px) {
    font-size: 1.rem;
  }


  
`;

export default Button;
