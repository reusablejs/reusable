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
  const [counter] = useCounter();
  const [step] = useStep();

  return (
    <div>
      <div>Counter: {counter}
      </div>
      <div>Step: {step}
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
