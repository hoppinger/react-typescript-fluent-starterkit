import { any, async, fromJSX, IOWidget, Unit, Widget } from "widgets-for-react"
import React from 'react';
import { Button } from "react-bootstrap";
import { ShoppingCartState, shoppingCartUpdaters } from "./shoppingCartState";
import { ShoppingProductsState } from "../products/productsState";
import { tryCatch, Updater } from "../../../widgets-extras";
import { ShoppingCartLayout } from "./shoppingCartLayout";

export const shoppingCartWidget = 
  (shoppingCart:ShoppingCartState, productsState:ShoppingProductsState) : Widget<Updater<ShoppingCartState>> =>  
  fromJSX<Updater<ShoppingCartState>, never>(setState =>
  <>
    <ShoppingCartLayout.YourCart />
    {
      shoppingCart.products
        .map((amount, productId) => {
          let product = productsState.products.get(productId)
          if (product == undefined) return <></>
          else return <>
            <ShoppingCartLayout.Product 
              product={product} 
              amount={amount}
              onMinusClick={() => 
                setState(
                  tryCatch<ShoppingCartState,ShoppingCartState>(
                    shoppingCartUpdaters.tryDecreaseProduct(productId), 
                    shoppingCartUpdaters.removeProduct(productId)
                  )
                )}
              onPlusClick={() => setState(shoppingCartUpdaters.addProduct(productId))}
              onXClick={() => 
                confirm(`Are you sure you want to remove ${productsState.products.get(productId)?.name}?`) ? 
                  setState(shoppingCartUpdaters.removeProduct(productId)) : undefined}
            />
            <hr className="mt-2 mb-3"/>
            </>
        })
        .valueSeq()
        .toArray()
    }
  </>).wrapHTML(ShoppingCartLayout.Sticky)
