import React from "react";
import ReactDOM from "react-dom";
// import { withHistory, ReuseProvider, createStore } from "./reuse";
import { ReuseProvider } from "./reuse";
import { Async } from "./Async";
// import { TimeTravel } from "./TimeTravel";
import "./styles.css";

// const store = withHistory(createStore)();
// const store = createStore();

function App() {
  return (
    <ReuseProvider>
      {/* <TimeTravel /> */}
      <Async />
    </ReuseProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
