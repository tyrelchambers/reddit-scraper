import React, {useState} from 'react'
import './Header.scss';
import Navbar from '../Navbar/Navbar';
import reddexLogo from '../../assets/reddex-logo.svg';
import {inject, observer } from 'mobx-react';
import MobileNav from '../Navbar/MobileNav';

const Header = inject("UserStore")(observer(({UserStore}) => {
  const [extended, setExtended] = useState(false);
  const extendedNav = extended ? "extended" : "";

  return(
    <header className="header d-f jc-c">
      <div className="wrapper d-f jc-sb ai-c">
        <div className="brand d-f">
          <img src={reddexLogo} alt="Reddex"/>
          <h3 className="ml-">Beta</h3>
        </div>
        <Navbar 
          redditProfile={UserStore.getRedditProfile()}
          />
        <MobileNav 
          redditProfile={UserStore.getRedditProfile()}
          extended={extendedNav}
          setExtended={() => setExtended(false)}
        />
        <div className="nav-toggle pos-a" onClick={() => setExtended(!extended)}>
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
        </div>
      </div>
    </header>
  );
}));

export default Header;