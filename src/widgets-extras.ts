import React from 'react';
import { Option, deconstruct, Action, Fun, IOWidget, Route, Sum, Widget, fromJSX, a, Unit, onlyIf, wait } from "widgets-for-react"

export const applyDoubleUpdater =
  <outerState, innerState, containerState>(
    updaters: Sum<Updater<outerState>, Updater<innerState>>,
    outerUpdater:Fun<Updater<outerState>, Updater<containerState>>,
    innerUpdater:Fun<Updater<innerState>, Updater<containerState>>) 
  : Updater<containerState> => 
  containerState =>
  deconstruct<Updater<outerState>, Updater<innerState>, Updater<containerState>>(
    l => outerUpdater(l), 
    r => innerUpdater(r), 
    updaters)(containerState)

export type DoubleUpdater<outerState, innerState> = Sum<Updater<outerState>, Updater<innerState>>

export type StandardLocalGlobalWidget<outerState, innerState> = 
  IOWidget<[outerState, innerState], DoubleUpdater<outerState, innerState>>

export type StandardLocalWidget<s> = IOWidget<s, Updater<s>>
export type Updater<s> = Action<s>
export type HTMLWrapper = Action<JSX.Element>

export const ensureHTML = function<a>(f:Action<a> | undefined) : Action<a> {
  if (f == undefined) return x => x
  else return f
}

type UrlToParamsTmp<url, acc> = 
  url extends [infer x, ...infer xs] ?
    x extends string ?
      { res:UrlToParamsTmp<xs, acc> }
    : { res:UrlToParamsTmp<xs, x & acc> }
  : acc

type UnboxRes<x> = 
  x extends { res: { res: { res: { res: { res: { res: never }}}}}} ? never :
  x extends { res: { res: { res: { res: { res: never }}}}} ? never :
  x extends { res: { res: { res: { res: never }}}} ? never :
  x extends { res: { res: { res: never }}} ? never :
  x extends { res: { res: never }} ? never :
  x extends { res: never } ? never :
  x extends { res: { res: { res: { res: { res: { res: infer a }}}}}} ? a :
  x extends { res: { res: { res: { res: { res: infer a }}}}} ? a :
  x extends { res: { res: { res: { res: infer a }}}} ? a :
  x extends { res: { res: { res: infer a }}} ? a :
  x extends { res: { res: infer a }} ? a :
  x extends { res: infer a } ? a :
  x

export type UrlToParams<url> = UnboxRes<UrlToParamsTmp<url, {}>>
export type Url<page> = page extends { url:infer url } ? url : { error:"no url", page:page }
export type PageParams<page> = UrlToParams<Url<page>>

export type CurrentPage<pages> = { 
  [pageKey in keyof pages]:
    Pick<pages[pageKey], Exclude<keyof pages[pageKey], "url">>
    & { 
        kind:pageKey,
        params:PageParams<pages[pageKey]>
      } 
  }[keyof pages]

export type RouteBuilder<state, pages, pageKey extends keyof pages> = 
  Fun<PageParams<pages[pageKey]>, CurrentPage<{ [k in pageKey]:pages[k] }>>

export type RouteBuilders<state, pages> =
  {
    [pageKey in keyof pages]:{
      make:RouteBuilder<state, pages, pageKey>,
    }
  }

export type RouteUpdater<state, page> = 
  Fun<PageParams<page>, Updater<state>>
  
export type RouteUpdaters<state, pages> =
  {
    [pageKey in keyof pages]:{
      jumpTo:RouteUpdater<state, pages[pageKey]>,
      url:string // <- in 4.1 this will come from the page url, right now this is a typing issue
    }
  }

export type Routes<state, pages> = 
{
  [pageKey in keyof pages]:Route<Updater<state>>
}

type ShouldComponentUpdateProps<o> = { shouldUpdate:boolean, inner:Widget<o>, onDone: (output: o) => void }
class ShouldComponentUpdate<o> extends React.Component<ShouldComponentUpdateProps<o>, {}> {
  shouldComponentUpdate() {
    return this.props.shouldUpdate
  }

  render() {
    return this.props.inner.run(this.props.onDone)
  }
}

export const shouldComponentUpdate = <o>(shouldUpdate:boolean, inner:Widget<o> ) : Widget<o> => 
  fromJSX(setState =>
    // <ShouldComponentUpdate shouldUpdate={shouldUpdate} inner={inner} onDone={setState} />
    React.createElement<ShouldComponentUpdateProps<o>>(ShouldComponentUpdate, 
      { 
        shouldUpdate, inner, onDone:setState
      })
  )

export const tryCatch = <a,b>(f:Fun<a,Option<b>>, fallback:Fun<a,b>) : Fun<a,b> => a =>
  deconstruct<Unit, b, b>(
    _ => fallback(a),
    b => b,
    f(a)
  )

export const timedCounterTo = (currentValue:number, maxValue:number, updateDelay?:number) =>
  onlyIf<Updater<number>>(currentValue < maxValue, 
    wait<Updater<number>>(updateDelay || 5, { key:`timed counter updater` })(() => x => x + 5)
  )