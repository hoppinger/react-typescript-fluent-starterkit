import { any, browserRouter, fromJSX, IOWidget, link, notFoundRouteCase, route, routerSwitch, stateful, Unit, Widget } from "widgets-for-react"
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom"
import { CurrentPage, StandardWidget, Updater } from "../../widgets-extras";
import { wizard } from "../wizard/wizardWidget";
import { Pages, routeUpdaters } from "./routes/routesState";
import { ContactUsState } from "./contactUs/contactUsState";
import { ProductsState } from "./products/productsState";

export type ProductId = number

export type Person = {
  name:string,
  surname:string
}
export const personUpdaters = {
  name:(newName:string) => (currentPerson:Person):Person => ({ ...currentPerson, name:newName }),
  surname:(newSurname:string) => (currentPerson:Person):Person => ({ ...currentPerson, surname:newSurname }),
}

export type State = {
  page:CurrentPage<Pages>,
  somethingElse:number
}

export const stateUpdaters = {
  updateContactUsState:(contactUsUpdater:Updater<ContactUsState>) => 
    (currentState:State):State => 
      ({...currentState, 
        page:
          currentState.page.kind == "contactUs" ?
            {...currentState.page, pageState:contactUsUpdater(currentState.page.pageState)}
          : currentState.page
      }),
  updateProductsState:(productsUpdater:Updater<ProductsState>) => 
  (currentState:State):State => 
    ({...currentState, 
      page:
        currentState.page.kind == "products" ?
          {...currentState.page, pageState:productsUpdater(currentState.page.pageState)}
        : currentState.page
    }),     
  routes:routeUpdaters
}
