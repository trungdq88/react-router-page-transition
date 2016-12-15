import React from 'react';
import { Link } from 'react-router';

export default class ItemDetailPage extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {
      doTransform: false,
      position: null,
      color: null,
    };
  }

  onTransitionWillStart(data) {
    if (!data.clickedItemData) {
      // Default animate position if user goto this page directly
      this.setState({
        doTransform: true,
        position: { top: 0, left: 0, height: '100%', width: 10 },
        color: 'gray',
      });
      return;
    }
    this.setState({
      doTransform: true,
      position: data.clickedItemData.position,
      color: data.clickedItemData.color,
    });
  }

  onTransitionDidEnd() {
    // Do your stuff here
  }

  transitionManuallyStart() {
    this.setState({
      position: {
        top: 0,
        height: '100%',
        left: 0,
        right: 0,
      },
      doTransform: true,
    });
  }

  transitionManuallyStop() {
    this.setState({
      doTransform: false,
    });
  }

  render() {
    return (
      <div
        style={{
          transform: this.state.doTransform ?
            `translate3d(0, ${this.state.position.top}px, 0)` :
              undefined,
          height: this.state.doTransform ?
            this.state.position.height : null,
          left: this.state.doTransform ?
            this.state.position.left : null,
          right: this.state.doTransform ?
            this.state.position.left : null,
          backgroundColor: this.state.color,
        }}
        className="transition-item detail-page"
      >
        <Link to="/">
          Item {this.props.params.itemId}
        </Link>
        <h1>
          Detail page here
        </h1>
        <Link to="/">
          Back
        </Link>
      </div>
    );
  }
}
