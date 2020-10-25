import { OrderedMap } from "immutable";
import { Updater } from "../../../widgets-extras";
import { ProductId } from "../products/productsState";

export type ShoppingCartState = {
  products:OrderedMap<ProductId, number>
}

export const initialShoppingCartState:ShoppingCartState = ({
  products:OrderedMap()
})

export const shoppingCartUpdaters = {
  addProduct:(productId:ProductId) : Updater<ShoppingCartState> => shoppingCart =>
    ({...shoppingCart, products:
      shoppingCart.products.has(productId) ?
        shoppingCart.products.update(productId, 1, x => x+1)
      : shoppingCart.products.set(productId, 1)
    }),
  decreaseOrRemoveProduct:(productId:ProductId) : Updater<ShoppingCartState> => shoppingCart =>
    ({...shoppingCart, products:
      shoppingCart.products.has(productId) && shoppingCart.products.get(productId)! > 1 ?
        shoppingCart.products.update(productId, x => x-1)
      : shoppingCart.products.remove(productId)
    }),
  removeProduct:(productId:ProductId) : Updater<ShoppingCartState> => shoppingCart =>
    ({...shoppingCart, products:
      shoppingCart.products.remove(productId)
    })
}
