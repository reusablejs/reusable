import React from "react";
import ReactDOM from "react-dom";
import { GlobalStateProvider } from "./useGlobalState";
import One from "./One";
import Two from "./Two";
import Three from "./Three";
import "./styles.css";

const initialState = {
  ui: {
    counter: 1,
    random: 0
  }
};

function App() {
  return (
    <GlobalStateProvider initialState={initialState}>
      <One />
      <Two />
      <Three />
    </GlobalStateProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
