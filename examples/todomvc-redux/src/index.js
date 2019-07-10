import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ReusableProvider } from "reusable";
import { composeWithDevTools } from "redux-devtools-extension";
import { createStore, applyMiddleware, combineReducers } from "redux";

import { todos } from "./todosReducer";
import { Header } from "./components/Header";
import { Todos } from "./components/Todos";
import { Footer } from "./components/Footer";

import "./style.css";

const rootReducer = combineReducers({
  todos
});
const middleware = [];
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

function App() {
  return (
    <Provider store={store}>
      <ReusableProvider>
        <section className="todoapp">
          <Header />
          <Todos />
          <Footer />
        </section>
      </ReusableProvider>
    </Provider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
