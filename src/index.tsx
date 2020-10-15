import React from 'react';
import ReactDOM from 'react-dom';
import { root } from './site/root/rootWidget';

ReactDOM.render(root.run(s => 
  console.log("Here's the latest state:", s)), 
  document.querySelector('#root'))
