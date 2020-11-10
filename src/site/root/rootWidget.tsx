import { inl, any, browserRouter, fromJSX, IOWidget, link, notFoundRouteCase, route, routerSwitch, stateful, Unit, Widget, onlyIf, wait } from "widgets-for-react"
import React from 'react';
import { applyDoubleUpdater, componentDidCatch, StandardLocalWidget, Updater } from "../../widgets-extras";
import { initialState, Person, personUpdaters, ProductId, State, stateUpdaters } from "./rootState";
import { routes } from "./routes/routesWidget";
import { contactUsWidget } from "./contactUs/contactUsWidget";
import { rootLayout } from "./rootLayout";
import { productsWidget } from "./products/productsWidget";
import { footer, navigation } from "./headerAndFooter/headerAndFooterWidget";
import { motion } from "framer-motion"
import { Card, Container, Jumbotron, Spinner } from "react-bootstrap";
import { homeLayout } from "./home/homeLayout";
import { aboutUsWidget } from "./aboutUs/aboutUsWidget";

export const page:IOWidget<State, Updater<State>> = currentState =>
  componentDidCatch(currentState.page.kind,
    currentState.page.kind == "contactUs" ?
      contactUsWidget(currentState.page.pageState)
        .map(stateUpdaters.updateContactUsState)
    : currentState.page.kind == "products" ?
      productsWidget(currentState.lastUpdate)([currentState.shoppingCart, currentState.productsState])
        .map(updater => 
            applyDoubleUpdater(
              updater, 
              stateUpdaters.updateShoppingCartState, 
              stateUpdaters.updateProductsState))      
    : currentState.page.kind == "errorHandlingTest" ?      
      fromJSX(_ =>
        <>
          {currentState}
        </>
      )
    : currentState.page.kind == "home" ?
      fromJSX(_ => 
        <homeLayout.welcome title={"Shoppinger, the online shop where dreams come true!"} />
      )
    : currentState.page.kind == "aboutUs" ?
      aboutUsWidget(currentState.aboutUsState).map(stateUpdaters.updateAboutUsState)
    :
    fromJSX(_ =>
      <div>Error: unknown page {currentState.page.kind}</div>
    ),
    (error => 
      fromJSX(_ =>
        <rootLayout.error error={error} />
      )
    )
  )



export const root = 
  browserRouter<State>()(
    stateful<State>()(currentState => 
      any<Updater<State>>()([
        routes(),
        navigation(currentState),
        page(currentState).wrapHTML(rootLayout.page),
        footer(currentState)
      ]).map(u => u(currentState))
    )(initialState)
  )
