import React from 'react';
import styled, { css } from 'styled-components';


interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void; // optional onClick handler
    primary?: boolean;
}


const Button = ({ children, onClick, primary = false }: ButtonProps) => {
  return <StyledButton onClick={onClick} primary={primary}>{children}</StyledButton>;
};

const StyledButton = styled.button<ButtonProps>`
  padding: 0.5em 1.8em;
  font-weight: bold;
  text-transform: uppercase;
  border: 2px solid;
  cursor: pointer;
  box-shadow: 0 0 10px blue;
  transition: all 0.3s ease;
  font-size: 1.2em;
  border-radius: 0px;
   

  ${props => props.primary ? css`
    background: blue;
    color: white;
    border-color: blue;


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
    font-size: 1.3rem;
    padding: 0.5em 1.75em;
  }
  @media screen and (min-width: 768px) and (max-width: 1024px) {
    font-size: 1.2rem;
  }


  
`;

export default Button;
