import './../less/main.less';
import '../material.html';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './Home.jsx';
import ListPage from './ListPage.jsx';
import ItemDetailPage from './ItemDetailPage.jsx';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={ListPage} />
      <Route path="/detail/:itemId" component={ItemDetailPage} />
    </Route>
  </Router>, document.getElementById('app'));
