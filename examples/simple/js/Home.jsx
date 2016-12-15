import React from 'react';
import ReactDom from 'react-dom';
// import PageTransition from '../../../src/PageTransition.jsx';
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
