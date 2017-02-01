import React from 'react';
import ReactDom from 'react-dom';
const PageTransition = require('../../../src/PageTransition.jsx').default(React, ReactDom);

export default (props) => (
  <div>
    <PageTransition
      timeout={500}
    >
      {props.children}
    </PageTransition>
  </div>
);
