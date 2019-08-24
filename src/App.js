import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './home';
import Salary from './salary';

function App() {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/salary" component={Salary} />
    </Router>
  );
}
export default App;
