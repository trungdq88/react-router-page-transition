import React from 'react';
import PageTransition from '../../../src/PageTransition.jsx';
import action from './action.js';
import { Switch, Route } from 'react-router-dom';
import ListPage from './ListPage.jsx';
import ItemDetailPage from './ItemDetailPage.jsx';

export default class Home extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      clickedItemData: null,
    };
  }

  componentDidMount() {
    this.obsClickedItemData = action
    .filter(a => a.name === 'CLICKED_ITEM_DATA')
    .map(a => a.data)
    .subscribe(clickedItemData => this.setState({ clickedItemData }));
  }

  componentWillUnmount() {
    this.obsClickedItemData.dispose();
  }

  render() {
    return (
      <div>
        <PageTransition
          timeout={1000}
          data={{ clickedItemData: this.state.clickedItemData }}
        >
          <Switch location={this.props.location}>
            <Route exact path="/" component={ListPage} />
            <Route path="/detail/:itemId" component={ItemDetailPage} />
          </Switch>
        </PageTransition>
      </div>
    );
  }
}
