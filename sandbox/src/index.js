import React, { useState } from "react";
import ReactDOM from "react-dom";
import { ReusableProvider, reusable } from "../../dist/reusable";

const useCounter = reusable(() => {
  return useState(0);
});

const useStep = reusable(() => {
  return useState(0);
});

function Header() {
  const [counter, setCounter] = useCounter();
  const [step, setStep] = useStep();

  return (
    <div>
      <div>Counter: {counter}
        <button onClick={() => setCounter(prev => prev + 1)}>+</button>
        <button onClick={() => setCounter(prev => prev - 1)}>-</button>
      </div>
      <div>Step: {step}
        <button onClick={() => setStep(prev => prev + 1)}>+</button>
        <button onClick={() => setStep(prev => prev - 1)}>-</button>
      </div>
    </div>
  );
}

function Footer() {
  const counter = useCounter(([val]) => val, (a, b) => Math.abs(a - b) < 2);
  const step = useStep(([val]) => Math.floor(val / 4));

  return (
    <div>
      <div>Counter evens: {counter}
      </div>
      <div>Step / 4: {step}
      </div>
    </div>
  );
}

const App = () => (
  <div>
    <Header></Header>
    <Footer></Footer>
  </div>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<ReusableProvider><App /></ReusableProvider>, rootElement);
