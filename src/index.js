import React from "react";
import ReactDOM from "react-dom";
// import { withHistory, ReuseProvider, createStore } from "./reuse";
// import { ReuseProvider } from "./reuse";
// import { Async } from "./Async";
// import { TimeTravel } from "./TimeTravel";
import "./styles.css";

import {reuse, reuseState} from './reuse';

const reuseCount = reuse(() => {
  const [count, setCount] = reuseState(0);
  const [step, setStep] = reuseState(0);

  return {
    count,
    step,
    setStep,
    setCount
  }
});

const reuseSelector = reuse(() => {
  const {count} = reuseCount();

  return count % 10;
});


const a1 = reuseCount();
console.log('count, step', a1.count, a1.step);
console.log('reuseSelector', reuseSelector());

console.log('setCount(2)');
reuseCount().setCount(2);

const a2 = reuseCount();
console.log('count, step', a2.count, a2.step);
console.log('reuseSelector', reuseSelector());

console.log('setStep(3)');
reuseCount().setStep(3);

const a3 = reuseCount();
console.log('count, step', a3.count, a3.step);
console.log('reuseSelector', reuseSelector());

// const store = withHistory(createStore)();
// const store = createStore();

function App() {
  return (<div>bla</div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
