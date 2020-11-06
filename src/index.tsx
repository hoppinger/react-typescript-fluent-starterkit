import { List } from 'immutable';
import React, { ErrorInfo } from 'react';
import ReactDOM from 'react-dom';
import { fromJSX, stateful, Unit } from 'widgets-for-react';
import { root } from './site/root/rootWidget';


type State = { a:number, b:number }
const MemoizeA = React.memo((props: {state:State }) => 
  <>
    <h2>Memoized on a</h2>
    <div>a: {props.state.a}</div>
    <div>b: {props.state.b}</div>  
  </>, (prev, curr) => prev.state.a == curr.state.a)

const test = 
  stateful<State>()(s0 =>
    fromJSX(setState =>
      <>
        <h2>Actual</h2>
        <div>a: {s0.a}</div>
        <div>b: {s0.b}</div>
        <button onClick={_ => setState({...s0, a:s0.a+1})}>A</button>
        <button onClick={_ => setState({...s0, b:s0.b+1})}>B</button>
        <MemoizeA state={s0} />
      </>
    )
  )({ a:0, b:0 })

ReactDOM.render(test.run(s => 
  console.log("Here's the latest state:", s)), 
  document.querySelector('#root'))

// ReactDOM.render(root.run(s => 
//   console.log("Here's the latest state:", s)), 
//   document.querySelector('#root'))
