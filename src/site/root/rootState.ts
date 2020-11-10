import { any, browserRouter, fromJSX, IOWidget, link, notFoundRouteCase, route, routerSwitch, stateful, Unit, Widget } from "widgets-for-react"
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom"
import { CurrentPage, StandardLocalWidget, Updater } from "../../widgets-extras";
import { Pages, routeBuilders, routeUpdaters } from "./routes/routesState";
import { ContactUsState } from "./contactUs/contactUsState";
import { initialProductsState, ProductsState } from "./products/productsState";
import { initialShoppingCartState, ShoppingCartState } from "./shoppingCart/shoppingCartState";
import { AboutUsState, initialAboutUsState } from "./aboutUs/aboutUsState";

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
  shoppingCart:ShoppingCartState,
  productsState:ProductsState,
  aboutUsState:AboutUsState,
  lastUpdate?:"shopping cart" | "products"
}

export const initialState:State = ({ 
  page:routeBuilders.home.make({}), 
  shoppingCart:initialShoppingCartState,
  productsState:initialProductsState,
  aboutUsState:initialAboutUsState
})

export const stateUpdaters = {
  updateContactUsState:(contactUsUpdater:Updater<ContactUsState>) => 
    (currentState:State):State => 
      ({...currentState, 
        page:
          currentState.page.kind == "contactUs" ?
            {...currentState.page, pageState:contactUsUpdater(currentState.page.pageState)}
          : currentState.page,
          lastUpdate:undefined
        }),
  updateShoppingCartState:(shoppingCartUpdater:Updater<ShoppingCartState>) => 
  (currentState:State):State => 
    ({...currentState, 
      shoppingCart:shoppingCartUpdater(currentState.shoppingCart),
      lastUpdate:"shopping cart"
    }),     
  updateProductsState:(productsUpdater:Updater<ProductsState>) => 
  (currentState:State):State => 
    ({...currentState,
      productsState:productsUpdater(currentState.productsState),
      lastUpdate:"products"
    }),
  updateAboutUsState:(aboutUsUpdater:Updater<AboutUsState>) => 
  (currentState:State):State => 
    ({...currentState,
      aboutUsState:aboutUsUpdater(currentState.aboutUsState),
      lastUpdate:undefined
    }),
  routes:routeUpdaters
}
