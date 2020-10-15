import { Action, Fun, IOWidget, Route } from "widgets-for-react"

export type StandardWidget<s> = IOWidget<s, Updater<s>>
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
