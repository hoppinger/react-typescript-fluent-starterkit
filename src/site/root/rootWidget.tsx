import { any, browserRouter, fromJSX, IOWidget, link, notFoundRouteCase, route, routerSwitch, stateful, Unit, Widget } from "widgets-for-react"
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom"
import { StandardWidget, Updater } from "../../widgets-extras";
import { wizard } from "../wizard/wizardWidget";
import { Person, personUpdaters, ProductId, State, stateUpdaters } from "./rootState";
import { wizardStateUpdaters, WizardState, initialWizardState } from "../wizard/wizardState";
import { routeUpdaters, routeWidgets } from "./routes/routesState";
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { navigation, routes } from "./routes/routesWidget";
import { contactUs } from "./contactUs/contactUsWidget";

export const page:IOWidget<State, Updater<State>> = currentState =>
  fromJSX(_ =>
    currentState.page.kind == "home" ?
      <div>Home</div>
    : currentState.page.kind == "aboutUs" ?
      <div>About us</div>
    : currentState.page.kind == "contactUs" ?
      <div>Contact us</div>
    : currentState.page.kind == "products" ?
      <div>Products </div>
    : currentState.page.kind == "product" ?
      <div>Product {currentState.page.params.productId}</div>
    : <div></div>
  )

export const root = 
  browserRouter<State>()(
    stateful<State>()(currentState => 
      any<Updater<State>>()([
        routes(),
        navigation(currentState),
        page(currentState)
      ]).map(u => u(currentState))
    )({ page:{ kind:"home", params:{} }, somethingElse:0, wizard1:initialWizardState(3, { name:"", surname:"" }) })
  )
