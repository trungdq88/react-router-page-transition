import './../less/main.less';
import '../index.html';

import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home.jsx';
import ListPage from './ListPage.jsx';
import ItemDetailPage from './ItemDetailPage.jsx';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Home}>
      <IndexRoute component={ListPage} />
      <Route path="/detail/:itemId" component={ItemDetailPage} />
    </Route>
  </Router>, document.getElementById('app'));
