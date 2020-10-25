import { any, browserRouter, fromJSX, IOWidget, link, notFoundRouteCase, route, routerSwitch, stateful, Unit, Widget } from "widgets-for-react"
import React from 'react';
import ReactDOM from 'react-dom';
import { StandardLocalWidget, Updater } from "../../../widgets-extras";
import { State, stateUpdaters } from "../rootState";
import { routeUpdaters, routeWidgets } from "./routesState";
import { navigationLayout as navigationLayout } from "./routesLayout";

export const routes = () =>
  routerSwitch<Updater<State>>()([
    routeWidgets.home,
    routeWidgets.products,
    // routeWidgets.product,
    routeWidgets.contactUs,
    routeWidgets.aboutUs,
    notFoundRouteCase<Updater<State>>(stateUpdaters.routes.home.jumpTo),
  ])

export const navigationItem = function<routeName extends keyof (typeof routeUpdaters)>(title:string, routeName:routeName) : StandardLocalWidget<State> { return state =>
  fromJSX(_ =>
    <navigationLayout.item
      isActive={state.page.kind == routeName}
      title={title}
      to={routeUpdaters[routeName].url}
    />
)}

export const navigation:StandardLocalWidget<State> = (state:State) =>
    any<Updater<State>>()([
      navigationItem("Home", "home")(state),
      navigationItem("About us", "aboutUs")(state),
      navigationItem("Products", "products")(state),
      navigationItem("Contact us", "contactUs")(state),
    ]).wrapHTML(navigationLayout.nav)
