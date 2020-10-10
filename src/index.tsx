import React from 'react';
import ReactDOM from 'react-dom';
import { site } from './site/root/rootWidget';

ReactDOM.render(site.run(s => 
  console.log("Here's the latest state:", s)), 
  document.querySelector('#root'))
