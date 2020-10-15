import { route, Unit } from "widgets-for-react"
import { State } from "../rootState";
import { PageParams, RouteBuilders, Routes as RouteWidgets, RouteUpdaters, Updater } from "../../../widgets-extras";

export type Pages =
  {
    home:{ url:[] },
    product:{ url:["products", { productId : number }], pageState?:Unit }, // <- pageState will become async loader
    products:{ url:["products"], pageState?:Unit }, // <- pageState will become async loader
    aboutUs:{ url:["about-us"] }
    contactUs:{ url:["contact-us"] }
  }

export const routeBuilders:RouteBuilders<State,Pages> = {
    home: {
      make:(params:PageParams<Pages["home"]>) => 
        ({ kind:"home", params:params })
    },
    aboutUs: {
      make: (params:PageParams<Pages["aboutUs"]>) => 
        ({ kind:"aboutUs", params:params })
      },
    contactUs: {
      make: (params:PageParams<Pages["contactUs"]>) => 
        ({ kind:"contactUs", params:params })
      },
    products: {
      make: (params:PageParams<Pages["products"]>) => 
        ({ kind:"products", params:params })
      },
    product: {
      make: (params:PageParams<Pages["product"]>) => 
        ({ kind:"product", params:params })
      }
  }
  
export const routeUpdaters:RouteUpdaters<State,Pages> = {
  home: {
    jumpTo:(params:PageParams<Pages["home"]>) : Updater<State> => s0 => 
      ({...s0, page:routeBuilders.home.make(params), somethingElse:s0.somethingElse+1 }),
    url:"/"
  },
  aboutUs: {
    jumpTo: (params:PageParams<Pages["aboutUs"]>) : Updater<State> => s0 => 
      ({...s0, page:routeBuilders.aboutUs.make(params), somethingElse:s0.somethingElse*2 }),
      url:"/about-us"
    },
  contactUs: {
    jumpTo: (params:PageParams<Pages["contactUs"]>) : Updater<State> => s0 => 
      ({...s0, page:routeBuilders.contactUs.make(params), somethingElse:s0.somethingElse*2 }),
      url:"/about-us"
    },
  products: {
    jumpTo: (params:PageParams<Pages["products"]>) : Updater<State> => s0 => 
      ({...s0, page:routeBuilders.products.make(params) }),
      url:"/products"
    },
  product: {
    jumpTo: (params:PageParams<Pages["product"]>) : Updater<State> => s0 => 
      ({...s0, page:routeBuilders.product.make(params) }),
      url:"/product/:productId([0-9])"
    }
}

export const routeWidgets:RouteWidgets<State, Pages> = 
  {
    home:route(routeUpdaters.home.url, routeUpdaters.home.jumpTo),
    aboutUs:route(routeUpdaters.aboutUs.url, routeUpdaters.aboutUs.jumpTo),
    contactUs:route(routeUpdaters.contactUs.url, routeUpdaters.contactUs.jumpTo),
    products:route(routeUpdaters.products.url, routeUpdaters.products.jumpTo),
    product:route(routeUpdaters.product.url, routeUpdaters.product.jumpTo)
  }
