import React from 'react';
import { Link } from 'react-router-dom';

export default (props) => (
  <div className="transition-item detail-page">
    <Link to="/">Back</Link>
    <h1>
      Detail {props.match.params.itemId}
    </h1>
  </div>
);
