import React from "react";
import ReactDOM from "react-dom";
import { ReuseProvider, spy } from "reusable";
import { Header } from './Header';
import { Todos } from './Todos';
import { Footer } from './Footer';

import './style.css';

spy(console.log);

function App() {
  return (
    <ReuseProvider>
      <section className="todoapp">
        <Header />
        <Todos />
        <Footer />
      </section>
    </ReuseProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
