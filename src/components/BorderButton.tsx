import React from 'react';
import styled from 'styled-components';


interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const BorderButton = ({ children, onClick }: ButtonProps) => {
  return <BorderButtonComponent onClick={onClick} >{children}</BorderButtonComponent>;
};

const BorderButtonComponent = styled.button`

/* Adapt the colors based on primary prop */

  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  color:  white;
  border: 2px solid white;
  border-radius: 0px;
  font-size: 1.2rem;
  padding: 0.5em 1.8em;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.8rem;
 
  p {
    color: white;
    max-width:8em;
    overflow:hidden;
    text-overflow: ellipsis;
    text-shadow: none;
  }

/* Hover effect */
  &:hover {
    background-color: white;
  }

  &:hover p {
    color: blue;
  }

  @media screen and (min-width: 768px) and (max-width: 1024px) {
    font-size: 1.1rem;
  }
    @media screen and (min-width: 1024px) {
        font-size: 1.2rem;
    }
`;


export default BorderButton;
