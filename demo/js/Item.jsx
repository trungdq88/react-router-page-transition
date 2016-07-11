import React from 'react';

export default (props) => (
  <div
    style={{ backgroundColor: props.color }}
    className="list-item"
  >
    {props.text}
  </div>
);
