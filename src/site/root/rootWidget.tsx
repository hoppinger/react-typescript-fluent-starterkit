import { inl, any, browserRouter, fromJSX, IOWidget, link, notFoundRouteCase, route, routerSwitch, stateful, Unit, Widget } from "widgets-for-react"
import React from 'react';
import { applyDoubleUpdater, StandardLocalWidget, Updater } from "../../widgets-extras";
import { initialState, Person, personUpdaters, ProductId, State, stateUpdaters } from "./rootState";
import { navigation, routes } from "./routes/routesWidget";
import { contactUsWidget } from "./contactUs/contactUsWidget";
import { rootLayout } from "./rootLayout";
import { productsWidget } from "./products/productsWidget";

export const page:IOWidget<State, Updater<State>> = currentState =>
  currentState.page.kind == "contactUs" ?
    contactUsWidget(currentState.page.pageState)
      .map(stateUpdaters.updateContactUsState)
  :
  currentState.page.kind == "products" ?
    productsWidget(currentState.lastUpdate)([currentState.shoppingCart, currentState.page.pageState])
      .map(updater => 
          applyDoubleUpdater(
            updater, 
            stateUpdaters.updateShoppingCartState, 
            stateUpdaters.updateProductsState))
  :
  fromJSX(_ =>
    currentState.page.kind == "home" ?
      <div>Home</div>
    : currentState.page.kind == "aboutUs" ?
      <div>About us</div>
    : currentState.page.kind == "contactUs" ?
      <div>Contact us</div>
    : currentState.page.kind == "products" ?
      <div>Products </div>
    // : currentState.page.kind == "product" ?
    //   <div>Product {currentState.page.params.productId}</div>
    : <div></div>
  )

export const root = 
  browserRouter<State>()(
    stateful<State>()(currentState => 
      any<Updater<State>>()([
        routes(),
        navigation(currentState),
        page(currentState).wrapHTML(rootLayout.page)
      ]).map(u => u(currentState))
    )(initialState)
  )
