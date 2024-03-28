import React from "react";
import { createRoot } from 'react-dom/client';

import {ReusableProvider} from 'reusable';
import {Header} from './Header';
import {Footer} from './Footer';

function App() {
  return (
    <ReusableProvider>
      <Header/>
      Counter in header and footer are reused
      <Footer/>
    </ReusableProvider>
  );
}

const rootElement = createRoot(document.getElementById("root"));
rootElement.render(<App />);
