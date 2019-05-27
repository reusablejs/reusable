import React from "react";
import ReactDOM from "react-dom";
import {ReusableProvider} from 'reusable';
import {Header} from './Header';
import {Footer} from './Footer';

function App() {
  return (
    <ReusableProvider>
      <Header/>
      Counter in header and footer are reused
      <Footer/>
    </ReusableProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
