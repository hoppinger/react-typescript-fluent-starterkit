import { List } from 'immutable';
import React, { ErrorInfo } from 'react';
import ReactDOM from 'react-dom';
import { fromJSX, stateful, Unit } from 'widgets-for-react';
import { root } from './site/root/rootWidget';

ReactDOM.render(root.run(s => 
  console.log("Here's the latest state:", s)), 
  document.querySelector('#root'))
