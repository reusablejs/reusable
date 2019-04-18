import React from "react";
import ReactDOM from "react-dom";
import { ReuseProvider, useReuse, spy, reuseState, reuseEffect, reuseMemo, Memo } from "../../dist/reusable";

spy(e => console.log(e.payload.debugName || e.payload.unitContext.debugName));

const counterUnit = Memo(() => {
  const [counter, setCounter] = reuseState(0);
  const [step, setStep] = reuseState(0);
  const generalEffect = reuseEffect(() => console.log('effect'))

  const nextStep = reuseMemo(() => counter + step, [counter, step]);

  return { counter, setCounter, step, setStep };
}, undefined, 'Moshe');

function App() {
  const { counter, setCounter, step, setStep } = useReuse(counterUnit);

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

const rootElement = document.getElementById("root");
ReactDOM.render(<ReuseProvider><App /></ReuseProvider>, rootElement);
