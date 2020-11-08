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

type MapOperations<k,v> =
  { 
    insert:[k,v]
  } | {
    update:[k,LensUpdater<v>]
  } | {
    remove:k
  } | {
    removeIf:[k,Fun<v,boolean>]
  }

type OptionOperations<v> =
  { 
    insert:v | Option<v>
  } | {
    remove:Unit
  } | {
    update:LensUpdater<v>
  } | {
    removeIf:Fun<v,boolean>
  }

type LensUpdater<a> = 
  a extends number | boolean | string | null ?
    a | Updater<a>
  : a extends Map<infer k, infer v> ? 
    MapOperations<k,v> | Array<MapOperations<k,v>>
  : a extends Option<infer v> ? 
    OptionOperations<v>
  : Lens<a>

type NewValue<a, fieldKey extends keyof a> = 
  a[fieldKey] extends number | boolean | string | null ?
    a[fieldKey] | Updater<a[fieldKey]>
  : LensUpdater<a[fieldKey]>

export interface Lens<a> {
  (_:a): a,
  field: <fieldKey extends keyof a>(fieldKey:fieldKey, newValue:NewValue<a,fieldKey>) => Lens<a>,
}

export const Lens = <a, >() : Lens<a> => null!

type FlatEntity = { field1:number, field2:number }
type PolymorphicEntity = { kind:"kind1", field1:number, field2:number } | { kind:"kind2", field3:string, field4:string } | { kind:"kind3", field5:string, field6:string }
type State = 
  {
    field1:string
    field2:number
    field3:boolean
    optionField1:Option<FlatEntity>
    optionField2:Option<string>
    mapField1:Map<number,FlatEntity>
    mapOptionField1:Map<number, Option<FlatEntity>>
    // mapUnionField1:Map<number, PolymorphicEntity>
    // mapMapField1:Map<number, Map<string, { field1:number, field2:number }>>
    // arrayField1:Array<number>
    // arrayField2:Array<{ field1:number, field2:number }>
    // listField1:List<{ field1:number, field2:number }>
    // listMapField1:List<{ field1:number, field2:boolean, field3:Map<string, { field1:number, field2:boolean }> }>
    // listOptionField1:List<Option<{ field1:number, field2:number }>>
    // listUnionField1:List<{ kind:"kind1", field1:number, field2:number } | { kind:"kind2", field3:string, field4:string } | { kind:"kind3", field5:string, field6:string }>
  }

const stateUpdaters = 
  Lens<State>()

    // change the value of field1 to "new value"
    .field("field1", "new value")
    // change the value of field2 to 101
    .field("field2", 101)
    // flip the value of field3: true => false, false => true
    .field("field3", b => !b)
    // insert (1,{ field1:1, field2:2 }) into mapField1
    .field("mapField1", { insert:[1,{ field1:1, field2:2 }] })
    .field("mapField1", 
    [
        // field1 becomes 1 at mapField1[1]
        { update:[1, Lens<FlatEntity>().field("field1", 1)] },
        // field1 becomes 2 at mapField1[2]
        { update:[2, Lens<FlatEntity>().field("field1", 2)] },
        // field2 is incremented by 1 at mapField1[3]
        { update:[3, Lens<FlatEntity>().field("field2", x => x + 1)] },
        // field2 is doubled at mapField1[4]
        { update:[4, Lens<FlatEntity>().field("field2", x => x * 2)] },
        // mapField1[5] is removed
        { remove:5 },
        // mapField1[6] is removed if its field1 is greater than its field2
        { removeIf:[6, v => v.field1 > v.field2] }
      ] )
    // optionField1 is set to none() if its field1 is negative 
    .field("optionField1", { removeIf:v => v.field1 < 0 })
    // optionField1.v.field2 is set to 200 if present
    .field("optionField1", { update:Lens<FlatEntity>().field("field2", 200) })
    // optionField1.v.field1 is incremented by 1 if present
    .field("optionField1", { update:Lens<FlatEntity>().field("field1", x => x + 1) })
    // mapOptionField1[1] becomes some({ field1:0, field2:0 })
    .field("mapOptionField1", { insert:[1, some({ field1:0, field2:0 })] })
    // mapOptionField1[1] becomes none if its field1 is negative, and it remains in the Map
    .field("mapOptionField1", { update:[1, { removeIf:v => v.field1 < 0 }] })
    // mapOptionField1[1] gets removed from the map if it is none
    .field("mapOptionField1", { removeIf:[1, v => v.v.kind == "l"] })
    // mapOptionField1[1], if present in the map, becomes some({ field1:0, field2:10 })
    .field("mapOptionField1", { update:[1, { insert:{ field1:0, field2:10 } }] })
    // mapOptionField1[1], if present in the map, and if it is not none, gets field1 incremented and field2 doubled
    .field("mapOptionField1", { update:[1, { update:Lens<FlatEntity>().field("field1", x => x + 1).field("field2", x => x * 2) }] })

const newState = () : State => stateUpdaters(null!)