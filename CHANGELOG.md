# Upgrade from 2.x to 3.x

## Breaking changes:
- Fix typo in `trasition-wrapper` -> `transition-wrapper`. You have to change this manually in your CSS if you are using 2.0.
- 3.0 now use ES6 import:

        import PageTransition from 'react-router-page-transition';

    old require statement is no longer work in 3.x

        const PageTransition = require('react-router-page-transition').default(React, ReactDom);

## New feature:
- `PageTransition` can now be used to wrap Redux connected components using
`data-transition-id` property. Example:

```jsx
<PageTransition>
  {isLoggedIn() ?
    <AdminPanel data-transition-id="admin-page" ... />
    :
    <Login data-transition-id="login-page" ... />
  }
</PageTransition>
```

