import { any, browserRouter, fromJSX, IOWidget, link, notFoundRouteCase, route, routerSwitch, stateful, Unit, Widget } from "widgets-for-react"
import React from 'react';
import ReactDOM from 'react-dom';
import { Routes as RouteWidgets, StandardLocalWidget, Updater } from "../../../widgets-extras";
import { State, stateUpdaters } from "../rootState";
import { Pages, routeUpdaters } from "./routesState";
import { navigationLayout as navigationLayout } from "./routesLayout";
import { Nav, Navbar } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'

export const routeWidgets:RouteWidgets<State, Pages> = 
  {
    home:route(routeUpdaters.home.url, routeUpdaters.home.jumpTo),
    aboutUs:route(routeUpdaters.aboutUs.url, routeUpdaters.aboutUs.jumpTo),
    contactUs:route(routeUpdaters.contactUs.url, routeUpdaters.contactUs.jumpTo),
    products:route(routeUpdaters.products.url, routeUpdaters.products.jumpTo),
    errorHandlingTest:route(routeUpdaters.errorHandlingTest.url, routeUpdaters.errorHandlingTest.jumpTo),
    // product:route(routeUpdaters.product.url, routeUpdaters.product.jumpTo)
  }

export const routes = () =>
  routerSwitch<Updater<State>>()([
    routeWidgets.home,
    routeWidgets.products,
    // routeWidgets.product,
    routeWidgets.contactUs,
    routeWidgets.aboutUs,
    routeWidgets.errorHandlingTest,
    notFoundRouteCase<Updater<State>>(stateUpdaters.routes.home.jumpTo),
  ])
