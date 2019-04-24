import React from "react";
import ReactDOM from "react-dom";
import { ReuseProvider, spy } from "reusable";
import Game from './Game';

import './style.css';

// spy(console.log);
function App() {
  return (
    <ReuseProvider>
      <Game />
    </ReuseProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
