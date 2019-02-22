import React from "react";
import ReactDOM from "react-dom";
import { withTimeTravel, ReuseProvider, createStore } from "./reuse";
import One from "./One";
import Two from "./Two";
import Three from "./Three";
import "./styles.css";

const initialState = {
  ui: {
    counter: 1,
    random: 0
  },
  transactions: []
};

const store = createStore(initialState);
const enhancedStore = withTimeTravel(store);

function App() {
  return (
    <ReuseProvider store={enhancedStore}>
      <button onClick={enhancedStore.undo}>Undo</button>
      <button onClick={enhancedStore.redo}>Redo</button>
      <One />
      <Two />
      <Three />
    </ReuseProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
