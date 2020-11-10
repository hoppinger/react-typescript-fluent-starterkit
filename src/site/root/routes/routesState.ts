import { route, Unit } from "widgets-for-react"
import { State } from "../rootState";
import { PageParams, RouteBuilders, RouteUpdaters, Updater } from "../../../widgets-extras";
import { ContactUsState, initialContactUsState } from "../contactUs/contactUsState";

export type Pages =
  {
    home:{ url:[] },
    products:{ url:["products"] },
    aboutUs:{ url:["about-us"] }
    contactUs:{ url:["contact-us"], pageState:ContactUsState }
    errorHandlingTest:{ url:["error-handling-test"] }
    // product:{ url:["product", { productId : number }], pageState?:Unit }, // <- pageState will become async loader
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
      ({ kind:"contactUs", params:params, pageState:initialContactUsState })
    },
  products: {
    make: (params:PageParams<Pages["products"]>) => 
      ({ kind:"products", params:params })
    },
  errorHandlingTest: {
    make: (params:PageParams<Pages["errorHandlingTest"]>) => 
      ({ kind:"errorHandlingTest", params:params })
    },
  // product: {
  //   make: (params:PageParams<Pages["product"]>) => 
  //     ({ kind:"product", params:params })
  //   }
}
  
export const routeUpdaters:RouteUpdaters<State,Pages> = {
  home: {
    jumpTo:(params:PageParams<Pages["home"]>) : Updater<State> => s0 => 
      ({...s0, page:routeBuilders.home.make(params) }),
    url:"/homedisabled"
  },
  aboutUs: {
    jumpTo: (params:PageParams<Pages["aboutUs"]>) : Updater<State> => s0 => 
      ({...s0, page:routeBuilders.aboutUs.make(params) }),
      url:"/" //"/about-us"
    },
  contactUs: {
    jumpTo: (params:PageParams<Pages["contactUs"]>) : Updater<State> => s0 => 
      ({...s0, page:routeBuilders.contactUs.make(params) }),
      url:"/contact-us"
    },
  products: {
    jumpTo: (params:PageParams<Pages["products"]>) : Updater<State> => s0 => 
      ({...s0, page:routeBuilders.products.make(params) }),
      url:"/products"
    },
  errorHandlingTest: {
    jumpTo: (params:PageParams<Pages["errorHandlingTest"]>) : Updater<State> => s0 => 
      ({...s0, page:routeBuilders.errorHandlingTest.make(params) }),
      url:"/error-handling-test"
    },
  // product: {
  //   jumpTo: (params:PageParams<Pages["product"]>) : Updater<State> => s0 => 
  //     ({...s0, page:routeBuilders.product.make(params) }),
  //     url:"/product/:productId([0-9])"
  //   }
}
