# React Router Page Transition
Highly customizable page transition component for your React Router

**NOTE:** Currently does not fully support react-router 4, see [Using with React Router 4](#using-with-react-router-4).

# Introduction

**React Router** is awesome, but doing transition between pages is hard, especially for complex ones.

No worries **react-router-page-transition** is here to help. You can use css to define your own transition
effect with custom data and callbacks, so now you can apply cool technique like [FLIP your animation](https://aerotwist.com/blog/flip-your-animations/)
and implement cool transitions like this:

**Live demo**: https://trungdq88.github.io/react-router-page-transition/

|Simple|Material|Reveal|
|------|--------|------|
|![rrpt-leave](https://cloud.githubusercontent.com/assets/4214509/22519594/709cbdc6-e8e3-11e6-9e35-1182e6121e27.gif)|![material](https://cloud.githubusercontent.com/assets/4214509/16781947/aa83ca34-48a7-11e6-8c93-dfdd794d7a28.gif) | ![reveal](https://cloud.githubusercontent.com/assets/4214509/16783423/1c58b880-48ae-11e6-97fb-5e92a7da1b40.gif)|

# Installation

    npm install react-router-page-transition --save

# Add to your project

```js
import PageTransition from 'react-router-page-transition';
```

```jsx
<PageTransition>
  {this.props.children}
</PageTransition>
```
- **Important:** `this.props.children` **must have** `transition-item` class in its root element. Example if you are passing `<ListPage />` as `this.props.children`:

```jsx
export default class ListPage extends React.Component {
  render() {
    return (
      <div id="list-page" class="transition-item">
      ...
      </div>
    );
  }
}
```

# How it works

- `PageTransition` component renders `{this.props.children}` inside a `<div class="transition-wrapper">...</div>`.

- When the route change, CSS classes will be added as following:

![image](https://cloud.githubusercontent.com/assets/4214509/22550195/903cb304-e981-11e6-8a36-c6e0d1a28e94.png)

- You'll need to define the transition in your CSS:

Example: sliding animation

```less
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

```

Sometimes it is impossible to implement your designer's awesome animation idea in just **only CSS**. In that case, you'll need the callbacks to customize your animation with **additional data**. See **API** document and example for more information.

# API

## Properties
- **timeout**: transition duration in milisecond, this must be the same with the `transition-duration` in your CSS.

   Example:
    ```jsx
        <PageTransition timeout={500}>
          {props.children}
        </PageTransition>
    ```

- **data**: custom data to send to the page component via `onTransitionWillStart`, `onTransitionDidEnd`, `transitionManuallyStart`, `transitionManuallyEnd`.

    Example:
    ```jsx
        <PageTransition
          data={{ clickedItemData: this.state.clickedItemData }}
        >
          {this.props.children}
        </PageTransition>
    ```

- **onLoad**: this callback will be call after the new page is finished replaced.

    Example:
    ```jsx
        <PageTransition
          onLoad={() => this.refs.scrollArea.scrollTop = 0}
        >
          {this.props.children}
        </PageTransition>
    ```

## Callback on children component
`PageTransition` component calls a several callbacks to its child component to pass user defined additional data for the animation. Child components are mounted via React Router when the route change.

**Notice:** all these callbacks will be called in a **Promise chain**, so if you are handleing async tasks inside the callback (for example `setState`), make sure you **return a Promise** to make everything work properly.

- **onTransitionWillStart(data)**: before the transition starts (before `transition-appear-active` class is added). `data` is the variable received from the `data` property of `PageTransition`.
- **transitionManuallyStart(data)**: if you don't use `transition-appear-active` class in CSS to animate your page, you can define this method in the child component to do the animation mannually. `transition-appear-active` will not be added to the child's DOM when this method exists.
- **onTransitionDidStart(data)**: after the transition started.
- **onTransitionWillEnd(data)**: before the transition stops (before `transition-appear-active` class is removed).
- **transitionManuallyStop(data)**: similar to `transitionManuallyStart`. `transition-appear-active` will not be removed to the child's DOM when this method exists.
- **onTransitionDidEnd(data)**: after the transition stopped (after `transition-appear-active` class is removed)

    Example:
    ```jsx
    export default class DetailPage extends React.Component {
      ...
      onTransitionWillStart(data) {
        return new Promise(resolve => {
            this.setState({ animating: false, postiton: data.position, opacity: 0 }, resolve);
        });
      }
      transitionManuallyStart(data) {
        return new Promise(resolve => {
            this.setState({ animating: true, postiton: DEFAULT_POSITION, opacity: 1 }, resolve);
        });
      }
      onTransitionDidStart(data) {
        // Animation is happening
      }
      onTransitionWillEnd(data) {
        // Animation is about to stop
      }
      transitionManuallyStop(data) {
        return new Promise(resolve => {
            this.setState({ animating: false }, resolve);
        });
      }
      onTransitionDidEnd(data) {
        // Page successfully replaced and finished animate
        this.callMyBusinessApi();
      }

      ...
    ```

Similar callbacks for **leave** event:

- onTransitionLeaveWillStart(data)
- transitionLeaveManuallyStart(data)
- onTransitionLeaveDidStart(data)
- onTransitionLeaveWillEnd(data)
- transitionLeaveManuallyStop(data)
- onTransitionLeaveDidEnd(data)

## Available CSS functional class names

- `transition-appear`, `transition-appear-active`, `transition-leave`, `transition-leave-active`.
- Root element of the transited page must have `transition-item` class.

## Using with Redux

By default, `PageTransition` will animates its children when `componentWillReceiveProps` is triggered. It compares `this.props.children !== nextProps.children` to know if the page has changed (ex: move from page Login to page AdminPanel).

When using `PageTransition` with Redux, you may end up having the animation triggered everytime the Redux state changes (ex: state change when you enter username, `componentWillReceiveProps` is triggered but the page is still Login page). In order to resolve this, you can use `data-transition-id` for the child components.

```jsx
    <PageTransition>
      {isLoggedIn() ?
        <AdminPanel data-transition-id="admin-page" ... />
        :
        <Login data-transition-id="login-page" ... />
      }
    </PageTransition>
```

When `data-transition-id` prop is provided, `PageTransition` will use this value
to compare the childrens. Now you can control exactly when will the pages are changed.

## Using with React Router 4

At the moment, callbacks are not supported on React Router 4, however the basic CSS transitions still works. You have to wrap your `<Route>` with `<Switch>`. Please notice that you **have to** pass the `location` prop to `<Switch>` to make it work.

```jsx
        <PageTransition>
          <Switch location={this.props.location}>
            <Route exact path="/" component={ListPage} />
            <Route path="/detail/:itemId" component={ItemDetailPage} />
          </Switch>
        </PageTransition>
```

See a live demo: https://codesandbox.io/s/n3rrym5y1l

# When to use this?

**Pros:**
 - Give you ability to implement complex animations / transitions.
 - Keep page structure clean.

**Cons:**
 - Requires extra setup for the components

# Examples

See [EXAMPLES.md](https://github.com/trungdq88/react-router-page-transition/blob/master/EXAMPLES.md)

# LICENSE

```
MIT License

Copyright (c) 2016 Dinh Quang Trung

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
