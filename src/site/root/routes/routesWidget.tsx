import { any, browserRouter, fromJSX, IOWidget, link, notFoundRouteCase, route, routerSwitch, stateful, Unit, Widget } from "widgets-for-react"
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom"
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { StandardWidget, Updater } from "../../../widgets-extras";
import { State, stateUpdaters } from "../rootState";
import { routeUpdaters, routeWidgets } from "./routesState";

export const routes = () =>
  routerSwitch<Updater<State>>()([
    routeWidgets.home,
    routeWidgets.aboutUs,
    routeWidgets.products,
    routeWidgets.product,
    notFoundRouteCase<Updater<State>>(stateUpdaters.routes.home.jumpTo),
  ])

export const navigationItem = function<routeName extends keyof (typeof routeUpdaters)>(title:string, routeName:routeName) : StandardWidget<State> { return state =>
  fromJSX(_ =>
    <Nav.Item>
      <Nav.Link active={state.page.kind == routeName}>
        <Link to={routeUpdaters[routeName].url}>{title}</Link>
      </Nav.Link>
    </Nav.Item>
)}

export const navigation:StandardWidget<State> = state =>
    any<Updater<State>>()([
      navigationItem("Home", "home")(state),
      navigationItem("About us", "aboutUs")(state),
      navigationItem("Products", "products")(state),
    ]).wrapHTML(html => 
      <Nav variant="tabs" className="mr-auto">{html}</Nav>)
