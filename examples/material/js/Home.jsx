import React from 'react';
import PageTransition from '../../src/PageTransition.jsx';

export default (props) => (
  <div>
    <PageTransition>
      {props.children}
    </PageTransition>
  </div>
);
