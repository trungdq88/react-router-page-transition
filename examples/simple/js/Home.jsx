import React from 'react';
import PageTransition from '../../../src/PageTransition.jsx';

export default props => (
  <div>
    <PageTransition timeout={500}>{props.children}</PageTransition>
  </div>
);
