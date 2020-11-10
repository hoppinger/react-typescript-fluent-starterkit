import React, { ErrorInfo } from 'react';
import { List, Map } from 'immutable';
import { Option, deconstruct, Action, Fun, IOWidget, Route, Sum, Widget, fromJSX, a, Unit, onlyIf, wait, none, some, nothing } from "widgets-for-react"

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

export const shouldComponentUpdate = <o, >(shouldUpdate:boolean, inner:Widget<o> ) : Widget<o> => 
  fromJSX(setState =>
    React.createElement<ShouldComponentUpdateProps<o>>(ShouldComponentUpdate, 
      { 
        shouldUpdate, inner, onDone:setState
      })
  )

export const listFromOption = <a,>(x:Option<a>) : List<a> =>
  x.v.kind == "l" ? List() : List().push(x.v.v)

export const arrayFromOption = <a,>(x:Option<a>) : Array<a> =>
  x.v.kind == "l" ? [] : [x.v.v]

export const fromOption = <a,>(o: Option<a>, a:a): a => deconstruct<Unit, a, a>(() => a, x => x, o)

export const tryCatch = <a,b,>(f:Array<Fun<a,Option<b>>> | Fun<a,Option<b>>, fallback:Fun<a,b>) : Fun<a,b> => a => {
  const results = List(Array.isArray(f) ? f : [f])
    .map(f => f(a))
    .flatMap(listFromOption)
  if (results.isEmpty()) return fallback(a)
  return results.first()
}

export const timedCounterTo = (currentValue:number, maxValue:number, step?:number, updateDelay?:number) =>
  onlyIf<Updater<number>>(currentValue < maxValue, 
    wait<Updater<number>>(updateDelay || 5, { key:`timed counter updater` })(() => x => x + (step || 5))
  )

export type FieldCastingValidator<field> = 
  field extends boolean ? { kind:"boolean", customValidationLogic?:Fun<field,boolean> }
  : field extends string ? { kind:"string", customValidationLogic?:Fun<field,boolean> }
  : field extends number ? { kind:"number", customValidationLogic?:Fun<field,boolean> }
  : field extends Array<infer entity> ? { kind:"array", 
    elementValidator:TypeCastingValidator<entity, keyof entity>, customValidationLogic?:Fun<entity,boolean> }
  : { kind:"unsupported" } 


export type TypeCastingValidator<entity, fieldKeys extends (keyof entity)> = 
  {
    [fieldKey in fieldKeys]:FieldCastingValidator<entity[fieldKey]>
  }

export const canSafelyCast = <entity,>(validator:TypeCastingValidator<entity, keyof entity>, valueToValidate:any, onError?:(fieldValidatorKey:any, valueToValidate:any) => void)
  : Option<entity> => {
  for (const fieldValidatorKey in validator) {
    const fieldValidator = validator[fieldValidatorKey]
    const customValidationLogic = (validator[fieldValidatorKey] as any).customValidationLogic
    if (fieldValidator.kind == "boolean" || fieldValidator.kind == "number" || fieldValidator.kind == "string") {
      if (fieldValidator.kind != typeof (valueToValidate[fieldValidatorKey]) || 
          (customValidationLogic != undefined && !customValidationLogic(valueToValidate[fieldValidatorKey]))) { 
        onError ? onError(fieldValidatorKey, valueToValidate) : null
        console.error(`Error in field ${fieldValidatorKey} when parsing ${JSON.stringify(valueToValidate)}`)
        return none()
      }
    } else if (fieldValidator.kind == "unsupported") {
      onError ? onError(fieldValidatorKey, valueToValidate) : null
      console.error(`Unsupported field ${fieldValidatorKey} when parsing ${JSON.stringify(valueToValidate)}`)
      return none()
    } else {
      const elementValidator = (fieldValidator as any).elementValidator
      if (
        List<unknown>(valueToValidate[fieldValidatorKey]).find(v =>
          canSafelyCast<unknown>(fieldValidator, v).v.kind == "l" ||
          (customValidationLogic != undefined && !customValidationLogic(v))
        )) {
          onError ? onError(fieldValidatorKey, valueToValidate) : null
          console.error(`Error in array ${fieldValidatorKey} when parsing ${JSON.stringify(valueToValidate)}`)
          return none()
        } 
    }
  }
  return some(valueToValidate as entity)
}


export type ComponentDidCatchProps<a> = { 
  onDone:(_:a) => void,
  catch?:IOWidget<[Error,ErrorInfo],a>
}
export type ComponentDidCatchState = Option<[Error,ErrorInfo]>
export class ComponentDidCatch<a> extends React.Component<ComponentDidCatchProps<a>, ComponentDidCatchState> {
  constructor(props:ComponentDidCatchProps<a>) {
    super(props)
    this.state = none()
  }

  componentDidCatch(error:Error, errorInfo:React.ErrorInfo) {
    this.setState(some([error, errorInfo]))
  }

  render() {
    if (this.state.v.kind == "l") {
      return this.props.children
    } else {
      return (this.props.catch || (_ => nothing()))(this.state.v.v).run(this.props.onDone)
    }
  }
}

export const componentDidCatch = <o,>(key:string, component:Widget<o>, fallback:IOWidget<[Error,ErrorInfo],o>) : Widget<o> => 
  fromJSX(setState => 
    React.createElement<ComponentDidCatchProps<o>>(ComponentDidCatch, 
      { 
        onDone:setState,
        catch:fallback,
        key
      }, 
      [component.run(setState)])
  )
  