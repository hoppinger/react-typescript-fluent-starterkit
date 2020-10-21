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
    products:OrderedMap<ProductId, ProductInfo>
  }

export type ProductsState = LoadingProductsState | ShoppingProductsState

export const initialProductsState:ProductsState = ({
  kind:"loading",
  productsLoader:loadProducts()
})

export const productsUpdaters = {
  renderUpTo:(newValue:Updater<number>):Updater<ProductsState> => 
    products => 
      products.kind == "shopping" ? 
        ({...products, renderUpTo:newValue(products.renderUpTo)})
      : products,
  productsLoader:(update:Updater<AsyncState<Array<ProductInfo>>>):Updater<ProductsState> => 
    products => {
      if (products.kind != "loading") return products
      const newLoader = update(products.productsLoader)
      if (newLoader.kind == "loaded") return { 
        kind:"shopping", renderUpTo:20, products:OrderedMap(newLoader.value.map(pi => [pi.productId, pi])) }
      return {...products, productsLoader:newLoader }
    },
}
