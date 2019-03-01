import React from "react";
import ReactDOM from "react-dom";
import { withHistory, ReuseProvider, createStore } from "./reuse";
import { One } from "./One";
import { Two } from "./Two";
import { Three } from "./Three";
import { Async } from "./Async";
import { TimeTravel } from "./TimeTravel";
import "./styles.css";

// const store = withHistory(createStore)();
const store = createStore();

function App() {
  return (
    <ReuseProvider store={store}>
      {/* <TimeTravel /> */}
      <One />
      <Two />
      <Three />
      <Async />
    </ReuseProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
