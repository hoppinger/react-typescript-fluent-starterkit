import { any, browserRouter, fromJSX, IOWidget, link, notFoundRouteCase, route, routerSwitch, stateful, Unit, Widget } from "widgets-for-react"
import React from 'react';
import ReactDOM from 'react-dom';
import { Routes as RouteWidgets, StandardLocalWidget, Updater } from "../../../widgets-extras";
import { State, stateUpdaters } from "../rootState";
import { Nav, Navbar } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faHeart, faCoffee, faCopyright } from '@fortawesome/free-solid-svg-icons'
import { routeUpdaters } from "../routes/routesState";
import { HeaderAndFooterLayout } from "./headerAndFooterLayout";
import { ShoppingCartLayout } from "../shoppingCart/shoppingCartLayout";

export const navigationItemLink = function<routeName extends keyof (typeof routeUpdaters)>(title:string, routeName:routeName) : StandardLocalWidget<State> { return state =>
  fromJSX(_ =>
    <HeaderAndFooterLayout.ItemLink
      isActive={state.page.kind == routeName}
      title={title}
      to={routeUpdaters[routeName].url}
    />
)}

export const navigation:StandardLocalWidget<State> = (state:State) =>
    any<Updater<State>>()([
      fromJSX(setState => 
        <HeaderAndFooterLayout.Logo 
          onClick={() => setState(routeUpdaters.home.jumpTo({}))} />
        ),
      navigationItemLink("Home", "home")(state),
      navigationItemLink("About us", "aboutUs")(state),
      navigationItemLink("Products", "products")(state),
      navigationItemLink("Contact us", "contactUs")(state),
      navigationItemLink("Error handling test", "errorHandlingTest")(state),
      fromJSX(setState => 
        <ShoppingCartLayout.ShoppingCartIcon 
          total={state.shoppingCart.products.reduce((total,amount,productId) => total + amount, 0)}
          onClick={() => setState(routeUpdaters.products.jumpTo({}))}
        />
      )
    ]).wrapHTML(HeaderAndFooterLayout.Nav)

export const footer:StandardLocalWidget<State> = (state:State) =>
  fromJSX(setState => 
    <HeaderAndFooterLayout.Footer />
  )
