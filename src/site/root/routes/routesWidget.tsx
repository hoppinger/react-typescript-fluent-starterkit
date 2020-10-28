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
    // product:route(routeUpdaters.product.url, routeUpdaters.product.jumpTo)
  }

export const routes = () =>
  routerSwitch<Updater<State>>()([
    routeWidgets.home,
    routeWidgets.products,
    // routeWidgets.product,
    routeWidgets.contactUs,
    routeWidgets.aboutUs,
    notFoundRouteCase<Updater<State>>(stateUpdaters.routes.home.jumpTo),
  ])

export const navigationItemLink = function<routeName extends keyof (typeof routeUpdaters)>(title:string, routeName:routeName) : StandardLocalWidget<State> { return state =>
  fromJSX(_ =>
    <navigationLayout.itemLink
      isActive={state.page.kind == routeName}
      title={title}
      to={routeUpdaters[routeName].url}
    />
)}

export const navigation:StandardLocalWidget<State> = (state:State) =>
    any<Updater<State>>()([
      navigationItemLink("Home", "home")(state),
      navigationItemLink("About us", "aboutUs")(state),
      navigationItemLink("Products", "products")(state),
      navigationItemLink("Contact us", "contactUs")(state),
      fromJSX(_ => 
        <>
          <FontAwesomeIcon icon={faShoppingCart} style={ { position:"absolute", top:"20px", right:"20px" }} />
          <div></div>
        </>
      )
    ]).wrapHTML(navigationLayout.nav)

export const footer:StandardLocalWidget<State> = (state:State) =>
  fromJSX(setState => 
    <>
      <footer>
        <Navbar bg="dark" variant="dark" sticky="bottom" style={{ height:"200px" }}>
          <Nav>
            <Navbar.Brand >Navbar with text</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                Signed in as: <a href="#login">Mark Otto</a>
              </Navbar.Text>
            </Navbar.Collapse>
          </Nav>
        </Navbar>    
      </footer>
    </>
  )
