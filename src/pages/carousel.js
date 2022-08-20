import React, {Component} from "react";
import ReactFullpage from '@fullpage/react-fullpage';
import LandingPage from './landing';
import About from "./about";

const Fullpage = () => (
    <ReactFullpage
      scrollingSpeed = {1000} /* Options here */
  
      render={({ state, fullpageApi }) => {
        return (
          <ReactFullpage.Wrapper>
            <div className="section">
              <LandingPage/>
            </div>
            <div className="section">
              <About/>
            </div>
          </ReactFullpage.Wrapper>
        );
      }}
    />
  );

export default Fullpage;