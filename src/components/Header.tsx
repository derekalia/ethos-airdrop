import React from 'react'
import { Link } from 'react-router-dom'
import logo from "../images/FREEDOM_FACTORY.png";
import styled from 'styled-components'
import "./Header.css";
import BorderButton from './BorderButton';

import { ConnectKitButton } from "connectkit";

interface HeaderProps {
    onClick?: () => void;
    connectFinished?:boolean;
    text: string;
}

const Header = ({onClick, connectFinished, text}: HeaderProps) => {
  return (
    <Nav>
        <div className="content-wrapper">
            <div className="nav-container">
                <div className="logo">
                    <img src={logo} alt="Freedom Factory Logo" className="logo" />
                </div>
            
                <ul className="nav-links">
                    <li>
                            <ConnectKitButton.Custom>
                                        {({ show, isConnected }) => (
                                            <BorderButton onClick={ () => {
                                                if(isConnected){
                                                    onClick
                                                }else{
                                                    show();
                                                }
                                            }}>
                                                <p>
                                                    {(isConnected && connectFinished) ? 
                                                        (text.substring(0,5) + "..." + text.substring(text.length-4,text.length)) 
                                                        : 
                                                        text
                                                    }
                                                </p>
                                            </BorderButton>
                                        )}
                                    </ConnectKitButton.Custom>
                    </li>
                </ul>
            </div>
            
        </div>
    </Nav>
  )
}

const Nav = styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 5vh;
    color: #fff;
    padding: 1em 0;
    z-index: 10;  
`

export default Header