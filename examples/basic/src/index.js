import React from "react";
import ReactDOM from "react-dom";
import {ReuseProvider} from 'reusable';
import {Header} from './Header';
import {Footer} from './Footer';

function App() {
  return (
    <ReuseProvider>
      <Header/>
      Counter in header and footer are reused
      <Footer/>
    </ReuseProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
