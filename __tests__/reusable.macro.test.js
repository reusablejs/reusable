const pluginTester = require("babel-plugin-tester");
const plugin = require("babel-plugin-macros");
const prettier = require("prettier");

const noUsageCode = `import { reuseState } from "../src/reuseable.macro";`;

const reuseStateCode = `
  import { reuseState } from "../src/reuseable.macro";
  
  const counter = () => {
    const [count, setCount] = reuseState(0);
  }
`;

const shorthandSyntaxCode = `
  import { reuseState } from "../src/reuseable.macro";
  
  const counter = () => reuseState(0)
`;

const reuseRefCode = `
  import { reuseRef } from "../src/reuseable.macro";
  
  const counter = () => {
    const count = reuseRef(0);
  }
`;

const reuseCallbackWithDependenciesCode = `
  import { reuseCallback } from "../src/reuseable.macro";
  
  const counter = () => {
    const count = reuseCallback(() => {}, []);
  }
`;

const reuseCallbackNoDependenciesCode = `
  import { reuseCallback } from "../src/reuseable.macro";
  
  const counter = () => {
    const count = reuseCallback(() => {});
  }
`;

const reuseReducerWithInitialState = `
  import { reuseReducer } from "../src/reuseable.macro";
  
  const reducer = (state, action) => state;
  const initialState = {};
  
  const counter = () => {
    const count = reuseReducer(reducer, initialState);
  }
`;

const reuseReducerCode = `
  import { reuseReducer } from "../src/reuseable.macro";
  
  const reducer = (state, action) => state;
  
  const counter = () => {
    const count = reuseReducer(reducer);
  }
`;

const reuseMemoCode = `
  import { reuseMemo } from "../src/reuseable.macro";
  
  const counter = () => {
    reuseMemo(() => {
    
    }, []);
  }
`;

const reuseMemoWithVariableCode = `
  import { reuseMemo } from "../src/reuseable.macro";
  
  const counter = () => {
    const count = reuseMemo(() => null)
  }
`;

const reuseEffectCode = `
  import { reuseEffect } from "../src/reuseable.macro";
  
  const counter = () => {
    reuseEffect(() => {
    
    }, []);
  }
`;

const InvalidDefaultImportCode = `
import customName from '../src/reuseable.macro';

const counter = () => {
  const [count, setCount] = customName.dodoState(0);
}
`;

const InvalidImportCode = `
import { dodoState } from "../src/reuseable.macro";

const counter = () => {
  const [count, setCount] = dodoState(0);
}
`;

pluginTester({
  title: 'macro',
  plugin,
  snapshot: true,
  babelOptions: {
    filename: __filename,
  },
  formatResult(result) {
    return prettier.format(result, { trailingComma: "es5", parser: 'babel' });
  },
  tests: {
    "no usage": noUsageCode,
    "should work with { reuseState }": reuseStateCode,
    "should work with { reuseState } shorthand": shorthandSyntaxCode,
    "should work with { reuseRef }": reuseRefCode,
    "should work with { reuseCallback } with dependencies": reuseCallbackWithDependenciesCode,
    "should work with { reuseCallback } without dependencies": reuseCallbackNoDependenciesCode,
    "should work with { reuseReducer } with initial state": reuseReducerWithInitialState,
    "should work with { reuseReducer } without initial state": reuseReducerCode,
    "should work with { reuseMemo }": reuseMemoCode,
    "should work with { reuseMemo } with variable": reuseMemoWithVariableCode,
    "should work with { reuseEffect }": reuseEffectCode,
    'should work with custom import name': {
      code: InvalidDefaultImportCode,
      error: true,
      snapshot: false
    },
    "invalid import": {
      code: InvalidImportCode,
      error: true,
      snapshot: false
    },
  },
});
