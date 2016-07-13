# React Router Page Transition
Highly customizable page transition component for your React Router

# Introduction

**React Router** is awesome, but doing transition between pages is hard, especially for complex ones.

No worries **react-router-page-transition** is here to help. You can use css to define your own transition
effect with custom data and callbacks, so now you can apply cool technique like [FLIP your animation](https://aerotwist.com/blog/flip-your-animations/)
and implement cool transitions like this:

**Live demo**: https://trungdq88.github.io/react-router-page-transition/

|Simple|Material|Reveal|
|------|--------|------|
|![simple](https://cloud.githubusercontent.com/assets/4214509/16784316/6dc99028-48b2-11e6-8f03-230e1178761b.gif)|![material](https://cloud.githubusercontent.com/assets/4214509/16781947/aa83ca34-48a7-11e6-8c93-dfdd794d7a28.gif) | ![reveal](https://cloud.githubusercontent.com/assets/4214509/16783423/1c58b880-48ae-11e6-97fb-5e92a7da1b40.gif)|

# Install

    npm install react-router-page-transition --save

# How it work?
TODO

**Pros:**
 - Keep page structure clean.
 - FLIP

**Cons:**
 - Requires extra setup for page components

# Example

## Simple zoom trasition

This is a simple transition: detail page zoom out from the middle.

### Router
```js
ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Home}>
      <IndexRoute component={ListPage} />
      <Route path="/detail/:itemId" component={ItemDetailPage} />
    </Route>
  </Router>, document.getElementById('app'));
```

### Home component
```js
import React from 'react';
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
export default class ItemDetailPage extends React.Component {
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
.trasition-wrapper {
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
  padding: 20px;
  background-color: #03a9f4;
  transition: transform 0.5s;
  height: 100vh;
  box-sizing: border-box;

  &.transition-appear {
    transform: scale(0);
  }

  &.transition-appear.transition-appear-active {
    transform: scale(1);
  }
}
```

## Material design transition
From a cool idea of [Material Motion](https://material.google.com/motion/material-motion.html#material-motion-how-does-material-move) that provide meaningful transition between pages.

# API
TODO
