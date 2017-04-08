import React from 'react';
import { Router, Route } from 'react-router';

import Login from './components/Login';
import MapElement from './components/MapElement';
import NotFound from './components/NotFound';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={Login} />
    <Route path="/map" component={MapElement} />
    <Route path="*" component={NotFound} />
  </Router>
);

export default Routes;
