import { Map, OrderedMap } from "immutable"
import { AsyncState, Fun, loadingAsyncState, Unit } from "widgets-for-react"
import { emailRegex, phoneNumberRegex, ValidationResult, Validations, validations } from "../../../shared"
import { Updater } from "../../../widgets-extras"
import { loadProducts } from "./productsApi"

export type ProductId = number

export type ProductInfo = {
  productId:ProductId
  name:string,
  description:string,
  rating:0|1|2|3|4|5,
  price:number,
  imageURL:string
}

export type LoadingProductsState = {
    kind:"loading",
    productsLoader:AsyncState<Array<ProductInfo>>
  }

export type ShoppingProductsState = {
    kind:"shopping",
    renderUpTo:number,
    currentPage:number,
    productsPerPage:number,
    lastPage:() => number,
    products:OrderedMap<ProductId, ProductInfo>
  }

export type ProductsState = LoadingProductsState | ShoppingProductsState

export const initialProductsState:ProductsState = ({
  kind:"loading",
  productsLoader:loadProducts()
})

export const productsUpdaters = {
  currentPage:(newValue:Updater<number>):Updater<ProductsState> => 
    products => 
      products.kind == "shopping" ? 
        ({...products, 
          currentPage:Math.max(Math.min(newValue(products.currentPage), products.lastPage()), 0),
          renderUpTo:products.productsPerPage })
      : products,
  renderUpTo:(newValue:Updater<number>):Updater<ProductsState> => 
    products => 
      products.kind == "shopping" ? 
        ({...products, renderUpTo:Math.min(newValue(products.renderUpTo), products.productsPerPage)})
      : products,
  productsLoader:(update:Updater<AsyncState<Array<ProductInfo>>>):Updater<ProductsState> => 
    products => {
      if (products.kind != "loading") return products
      const newLoader = update(products.productsLoader)
      if (newLoader.kind == "loaded") return { 
        kind:"shopping", 
        currentPage:0, 
        productsPerPage:17, 
        renderUpTo:17, 
        products:OrderedMap(newLoader.value.map(pi => [pi.productId, pi])),
        lastPage:function(this:ShoppingProductsState) { return Math.floor(this.products.count() / this.productsPerPage) }
      }
      return {...products, productsLoader:newLoader }
    },
}
