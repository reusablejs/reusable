import React, { useState } from "react";
import ReactDOM from "react-dom";
import { ReusableProvider, reusable } from "../../dist/reusable";

const useCounter = reusable(() => {
  return useState(0);
});

const useStep = reusable(() => {
  return useState(0);
});

const useMultiply = reusable(() => {
  const [counter] = useCounter();
  const [step] = useStep();

  return counter * step;
})

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

const Multiply = () => {
  return <span>{useMultiply()}</span>;
}

const App = () => {
  const [showMultiply, setShowMultiply] = useState(true);

  return (
    <div>
      <Header/>
      {showMultiply ? <Multiply/> : null }
      <button onClick={() => setShowMultiply(prev => !prev)}>toggle</button>
      <Footer/>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<ReusableProvider><App /></ReusableProvider>, rootElement);
