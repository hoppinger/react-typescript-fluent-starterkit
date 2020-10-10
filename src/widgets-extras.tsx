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
  [page in keyof pages]:
    Pick<pages[page], Exclude<keyof pages[page], "url">>
    & { 
        kind:page,
        params:PageParams<pages[page]>
      } 
  }[keyof pages]

export type RouteBuilder<state, pages, page> = 
  Fun<PageParams<page>, CurrentPage<pages>>

export type RouteBuilders<state, pages> =
  {
    [ page in keyof pages]:{
      make:RouteBuilder<state, pages, pages[page]>,
    }
  }

export type RouteUpdater<state, page> = 
  Fun<PageParams<page>, Updater<state>>
  
export type RouteUpdaters<state, pages> =
  {
    [ page in keyof pages]:{
      jumpTo:RouteUpdater<state, pages[page]>,
      url:string // <- in 4.1 this will come from the page url, right now this is a typing issue
    }
  }

export type Routes<state, pages> = 
{
  [ page in keyof pages]:Route<Updater<state>>
}
