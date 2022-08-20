import React from "react";
import { Carousel } from "react-scroll-slider";
import LandingPage from './landing';
import About from "./about";

const FullPage = () => (
  <Carousel>
    <LandingPage />
    <About />
  </Carousel>
);

export default FullPage;