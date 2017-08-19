import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ListPage from './ListPage.jsx';
import ItemDetailPage from './ItemDetailPage.jsx';
import PageTransition from '../../../src/PageTransition.jsx';

export default (props) => (
  <div>
    <PageTransition
      timeout={500}
    >
      <Switch location={props.location}>
        <Route exact path="/" component={ListPage} />
        <Route path="/detail/:itemId" component={ItemDetailPage} />
      </Switch>
    </PageTransition>
  </div>
);
