import React from 'react';
import { Link } from 'react-router';
import randomColor from 'randomcolor';
import Item from './Item.jsx';

export default class ListPage extends React.Component {
  constructor(props) {
    super(props);

    const items = [];
    for (let i = 1; i < 20; i++) {
      items.push({
        id: i,
        text: `Item ${i}`,
        color: randomColor(),
      });
    }

    this.state = {
      items,
    };
  }

  render() {
    return (
      <div className="transition-item list-page">
        <a href="../">Back to index page</a>
        {this.state.items.map(item => (
          <Link key={item.id} className="list-item" to={`/detail/${item.id}`}>
            <Item {...item} />
          </Link>
        ))}
      </div>
    );
  }
}
