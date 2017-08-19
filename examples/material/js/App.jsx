import './../less/main.less';
import '../index.html';

import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home.jsx';
import { HashRouter, Route } from 'react-router-dom';

ReactDOM.render(
  <HashRouter>
    <Route path="/" component={Home} />
  </HashRouter>
  , document.getElementById('app'));
