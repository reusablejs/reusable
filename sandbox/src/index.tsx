import React, { useState } from "react";
import ReactDOM from "react-dom";
import { ReusableProvider, createStore } from "../../dist";

const useCounter = createStore(() => {
  return useState(0);
});

const useStep = createStore(() => {
  return useState(0);
});

const useFnObject = createStore(() => {
  const [_, setState] = useState(0);

  const callback = () => {
    console.log('callback')
    setState(10);
  }
  return {
    callback
  };
});

const useMultiply = createStore(() => {
  const [counter] = useCounter();
  const [step] = useStep();

  return counter * step;
})

function Header() {
  const [counter, setCounter] = useCounter();
  const [step, setStep] = useStep();

  return (
    <header>
      <div>Counter: { counter }
        <button onClick={ () => setCounter((prev:number) => prev + 1) }>+</button>
        <button onClick = {() => setCounter((prev:number) => prev - 1)}>-</button>
      </div>
      <div> Step: { step }
        <button onClick={ () => setStep((prev:number) => prev + 1) }> +</button>
        <button onClick = {() => setStep((prev:number) => prev - 1)}> -</button>
      </div>
    </header>
  );
}

function Footer() {
    const counter = useCounter(([val]) => val, (a, b) => Math.abs(a - b) < 2);
  const step = useStep(([val]) => Math.floor(val / 4));

  return (
    <footer>
      <div>Counter evens: { counter }</div>
      <div> Step / 4: { step }</div>
    </footer>
  );
}

const Multiply = () => {
  return <span>{ useMultiply() } </span>;
}

const App = () => {
  const [showMultiply, setShowMultiply] = useState(true);
  const callback = useFnObject(state => state.callback);
  setTimeout(() => callback(), 1000);

  return (
    <div>
      <Header/>
      { showMultiply ? <Multiply/> : null }
      <button onClick = {() => setShowMultiply(prev => !prev)}>toggle</button>
      <Footer/>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<ReusableProvider><App /></ReusableProvider >, rootElement);
