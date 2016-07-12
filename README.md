# react-router-page-transition
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

# Usage

# Simple zoom trasition

## App component
```
import PageTransition from 'react-router-page-transition';

// Render
<PageTransition>
  {props.children}
</PageTransition>
```

## DetailPage component
Add class `transition-item` to your root element, we will use this to animate the page
when route change.
```
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

## CSS:
Define animation using CSS
```
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
.list-page {
  padding: 20px;
  background-color: #fff;
  transition: opacity 0.5s;
  height: 100vh;
  box-sizing: border-box;

  &.transition-appear {
    opacity: 0.01;
  }

  &.transition-appear.transition-appear-active {
    opacity: 1;
  }
}
```
