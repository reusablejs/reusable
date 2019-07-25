import React from "react";
import ReactDOM from "react-dom";
import { ReusableProvider } from "reusable";

import "./style.css";
import { Starwars } from "./Starwars";

function App() {
  return (
    <ReusableProvider>
      <Starwars />
    </ReusableProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
