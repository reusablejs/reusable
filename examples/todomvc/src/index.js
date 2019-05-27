import React from "react";
import ReactDOM from "react-dom";
import { ReusableProvider } from "reusable";
import { Header } from './Header';
import { Todos } from './Todos';
import { Footer } from './Footer';

import './style.css';

function App() {
  return (
    <ReusableProvider>
      <section className="todoapp">
        <Header />
        <Todos />
        <Footer />
      </section>
    </ReusableProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
