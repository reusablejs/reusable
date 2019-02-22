import React from "react";
import ReactDOM from "react-dom";
import { withHistory, ReuseProvider, createStore } from "./reuse";
import { One } from "./One";
import { Two } from "./Two";
import { Three } from "./Three";
import { TimeTravel } from "./TimeTravel";
import "./styles.css";

const initialState = {
  ui: {
    counter: 1,
    random: 0
  },
  transactions: []
};

const store = withHistory(createStore)(initialState);

function App() {
  return (
    <ReuseProvider store={store}>
      <TimeTravel />
      <One />
      <Two />
      <Three />
    </ReuseProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
