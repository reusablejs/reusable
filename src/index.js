import React from "react";
import ReactDOM from "react-dom";
// import { withHistory, ReuseProvider, createStore } from "./reuse";
// import { ReuseProvider } from "./reuse";
// import { Async } from "./Async";
// import { TimeTravel } from "./TimeTravel";
import "./styles.css";

import {Reuse, reuse, reuseState, ReuseProvider, useReuse, withReuse} from './reuse';

const counter = () => {
  const [count, setCount] = reuseState(0);
  const [step, setStep] = reuseState(0);

  return {
    count,
    step,
    setStep,
    setCount
  }
};

const selectCount = () => reuse(counter).count;

const modulo = () => {
  const count = reuse(selectCount);
  console.log('recalc modulo');
  return count % 10;
};


// const store = createStore();
// setCurrentStore(store);

// store.subscribe(counter, ({count, step}) => {
//   console.log('count', count);
//   console.log('step', step);
// });

// const a = reuse(counter);

// console.log('a.setCount(2)');
// a.setCount(2);
// console.log('a2.setStep(3)');
// a.setStep(3);

// const a2 = reuse(counter);
// console.log('a2.count', a2.count);
// console.log('a2.step', a2.step);

function Comp() {
  const {count, setCount, step, setStep} = useCounter();

  return (<div>
    count: <input value={count} onChange={e => setCount(e.target.value)} /><br/>
    step: <input value={step} onChange={e => setStep(e.target.value)} /><br/>
  </div>)
}

function Comp2() {
  const {count, step} = useCounter();

  return (<div>
    count: {count}<br/>
    step: {step}<br/>
  </div>)
}

function Comp3() {
  const countMod10 = useReuse(modulo);
  console.log('Comp3');

  return (<div>
    count modulo 10: {countMod10}<br/>
  </div>)
}

class Comp4 extends React.Component {
  render() {
    const {count} = this.props;
    console.log('render HOC');
    return (
      <div>
        withCounter.count = {count}<br/>
      </div>
    );
  }
}

const WrappedComp4 = withReuse(
  ([counter]) => ({
    count: counter.count
  }),
  [counter]
)(Comp4);

const Comp5 = () => (
  <div>
    render count: 
    <Reuse unit={counter}>
      {
        ({count}) => <span>{count}</span>
      }
    </Reuse><br/>
  </div>
);

function App() {
  return (
    <ReuseProvider>
      <Comp/>
      <Comp2/>
      <Comp3/>
      <WrappedComp4/>
      <Comp5/>
    </ReuseProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
