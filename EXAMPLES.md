# Examples

## Example 1: Simple sliding trasition

![rrpt-leave](https://cloud.githubusercontent.com/assets/4214509/22519594/709cbdc6-e8e3-11e6-9e35-1182e6121e27.gif)

This is a simple transition: detail page slide in from the right.

### Router
```js
ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Home}>
      <IndexRoute component={ListPage} />
      <Route path="/detail/:itemId" component={DetailPage} />
    </Route>
  </Router>, document.getElementById('app'));
```

### ListPage component

```js
export default class ListPage extends React.Component {

  ...

  render() {
    return (
      <div className="transition-item list-page">
        {this.state.items.map(item => (
          <Link
            key={item.id}
            className="list-item"
            to={`/detail/${item.id}`}
          >
            <Item {...item} />
          </Link>
        ))}
      </div>
    );
  }

```

### Home component
```js
import React from 'react';
import ReactDom from 'react-dom';
import PageTransition from 'react-router-page-transition';

export default (props) => (
  <div>
    <PageTransition>
      {props.children}
    </PageTransition>
  </div>
);
```

### DetailPage component
Add class `transition-item` to your root element, we will use this to animate the page
when route change.
```jsx
export default class DetailPage extends React.Component {
  render() {
    return (
      <div className="transition-item detail-page">
        <Link to="/">Back</Link>
        <h1>
          Detail {this.props.params.itemId}
        </h1>
      </div>
    );
  }
}
```

### CSS:
Define animation using CSS

```less
.transition-wrapper {
  position: relative;
  z-index: 1;
  .transition-item {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
  }
}
.detail-page {
  overflow: auto;
  box-sizing: border-box;
  padding: 20px;
  height: 100vh;
  background-color: #03a9f4;
  transition: transform 0.5s, opacity 0.5s;

  &.transition-appear {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  &.transition-appear.transition-appear-active {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  &.transition-leave {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  &.transition-leave.transition-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
}
.list-page {
  overflow: auto;
  box-sizing: border-box;
  padding: 20px;
  height: 100vh;
  background-color: #fff;
  transition: transform 0.5s, opacity 0.5s;
  transform: translate3d(0, 0, 0);

  &.transition-appear {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  &.transition-appear.transition-appear-active {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  &.transition-leave {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  &.transition-leave.transition-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
}

```

**See demo:** https://trungdq88.github.io/react-router-page-transition/simple/

## Example 2: Material design transition

From a cool idea of [Material Motion](https://material.google.com/motion/material-motion.html#material-motion-how-does-material-move) that provide meaningful transition between pages.

![material-sample](https://cloud.githubusercontent.com/assets/4214509/16789846/0ebb37f2-48db-11e6-8755-f106e5ae1488.gif)

![material](https://cloud.githubusercontent.com/assets/4214509/16781947/aa83ca34-48a7-11e6-8c93-dfdd794d7a28.gif)

In order to implement this, we need to pass custom data into the detail page, which requires a data flow management for the app. In this example, I'll use **RxJS** to pass data between ListPage component, Home component and ItemDetalPage component, but you can use another library to handle the data (like Flux or Redux).

### ListPage component
See the `onClick` method, we send the clicked item's data (color and position) to the action.
```js
  render() {
    return (
      <div className="transition-item list-page">
        {this.state.items.map(item => (
          <Link
            key={item.id}
            className="list-item"
            onClick={e => action.onNext({
              name: 'CLICKED_ITEM_DATA',
              data: {
                position: e.target.getBoundingClientRect(),
                color: item.color,
              },
            })}
            to={`/detail/${item.id}`}
          >
            <Item {...item} />
          </Link>
        ))}
      </div>
    );
  }
```

### Home component
Home component receives the data and pass it to the `PageTransition` component.

```js
export default class Home extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      clickedItemData: null,
    };
  }

  componentDidMount() {
    // Receive data from the clicked item
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
          data={{ clickedItemData: this.state.clickedItemData }}
        >
          {this.props.children}
        </PageTransition>
      </div>
    );
  }
}
```

### DetailPage component
This component will receive the callbacks with data from `PageTransition` component, then we can use tihs to animate our page as we want.

```js
export default class DetailPage extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {
      doTransform: false,
      position: null,
      color: null,
    };
  }

  onTransitionWillStart(data) {
    // Start position of the page
    this.setState({
      doTransform: true,
      position: data.clickedItemData.position,
      color: data.clickedItemData.color,
    });
  }

  onTransitionDidEnd() {
    // Transition is done, do your stuff here
  }

  transitionManuallyStart() {
    // When this method exsits, `transition-appear-active` will not be added to the dom
    // we will define our animation manually.
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
    // When this method exsits, `transition-appear-active` will not be removed
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
```

### CSS

```css
.transition-wrapper {
  position: relative;
  z-index: 1;
  .transition-item {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
}

.detail-page {
  padding: 10px 10px;
  background-color: #03a9f4;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;

  a {
    color: white;
  }

  &.transition-appear {
    transition: transform 1s cubic-bezier(0.7, 0, 0.25, 1),
      left 1s cubic-bezier(0.7, 0, 0.25, 1),
      right 1s cubic-bezier(0.7, 0, 0.25, 1),
      height 1s cubic-bezier(0.7, 0, 0.25, 1);
  }

  &.transition-appear.transition-appear-active {
  }
}

```

**See demo:** https://trungdq88.github.io/react-router-page-transition/material/

## Example 3: Reveal effect

![reveal](https://cloud.githubusercontent.com/assets/4214509/16783423/1c58b880-48ae-11e6-97fb-5e92a7da1b40.gif)

Similar to the material example, we use `border-radius` to animate the circle.

**See demo:** https://trungdq88.github.io/react-router-page-transition/reveal/
