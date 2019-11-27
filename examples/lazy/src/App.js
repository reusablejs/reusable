import React, { Suspense, lazy } from 'react';
import { ReusableProvider } from 'reusable';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './Home';
// import Users from './Users';

const Users = lazy(() => {
  const result = import('./Users');
  result.then(a => console.log(a));
  return result;
});

function App() {
  return (
    <ReusableProvider>
      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/users" component={Users} />
          </Switch>
        </Suspense>
      </Router>
    </ReusableProvider>
  );
}

export default App;
