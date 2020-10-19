import { any, browserRouter, fromJSX, IOWidget, link, notFoundRouteCase, route, routerSwitch, stateful, Unit, Widget } from "widgets-for-react"
import React from 'react';
import ReactDOM from 'react-dom';
import { StandardWidget, Updater } from "../../../widgets-extras";
import { State, stateUpdaters } from "../rootState";
import { routeUpdaters, routeWidgets } from "./routesState";
import { navigationWrappers as navigationLayout } from "./routesLayout";

export const routes = () =>
  routerSwitch<Updater<State>>()([
    routeWidgets.home,
    routeWidgets.aboutUs,
    routeWidgets.products,
    routeWidgets.product,
    routeWidgets.contactUs,
    notFoundRouteCase<Updater<State>>(stateUpdaters.routes.home.jumpTo),
  ])

export const navigationItem = function<routeName extends keyof (typeof routeUpdaters)>(title:string, routeName:routeName) : StandardWidget<State> { return state =>
  fromJSX(_ =>
    <navigationLayout.item 
      isActive={state.page.kind == routeName}
      title={title}
      to={routeUpdaters[routeName].url}
    />
)}

export const navigation:StandardWidget<State> = state =>
    any<Updater<State>>()([
      navigationItem("Home", "home")(state),
      navigationItem("About us", "aboutUs")(state),
      navigationItem("Products", "products")(state),
      navigationItem("Contact us", "contactUs")(state),
    ]).wrapHTML(navigationLayout.navWrapper)
