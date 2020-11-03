import { Fun, none, Option, some } from "widgets-for-react";
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
  tryDecreaseProduct:(productId:ProductId) : Fun<ShoppingCartState,Option<ShoppingCartState>> => shoppingCart =>
    shoppingCart.products.has(productId) && shoppingCart.products.get(productId)! > 1 ?
      some({...shoppingCart, products:        
        shoppingCart.products.update(productId, x => x-1)
      })
    : none(),
  removeProduct:(productId:ProductId) : Updater<ShoppingCartState> => shoppingCart =>
    ({...shoppingCart, products:
      shoppingCart.products.remove(productId)
    })
}
