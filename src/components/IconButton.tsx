import React from 'react';
import styled, { css } from 'styled-components';


interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void; // optional onClick handler
    disabled?: boolean;
    width?:number; //in px
    height?:number; //in px

}


const IconButton = ({ children, onClick, disabled = false }: ButtonProps) => {
  return <IconButtonComponent onClick={onClick} disabled={disabled}>{children}</IconButtonComponent>;
};

const IconButtonComponent = styled.button<ButtonProps>`
  width:100%;
  height:100%;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8em;
  border-radius: 0px;
  display:flex;
  justify-content: center;
  align-items:center;
  padding:0.4em;
  box-sizing: border-box;
  
    

  ${props => props.disabled ? css`
    &:hover {
    box-shadow: 0 0 0 transparent;
      background: rgba(255, 255, 255, 0.2);;
        color: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.2);
    }
  ` : css`
    
    &:hover {
    box-shadow: 0 0 10px blue;
      background: white;
        color: blue;
        border-color: white;
    }
  `}

  ${props => props.disabled ? css`

    background: transparent;
    color: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.2);

  ` : css`
    
    background: transparent;
    color: white;
    border: 2px solid white;

  `}

  


  
`;

export default IconButton;
