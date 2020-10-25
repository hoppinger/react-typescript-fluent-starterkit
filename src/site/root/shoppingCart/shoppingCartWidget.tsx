import { any, async, fromJSX, IOWidget, Unit, Widget } from "widgets-for-react"
import React from 'react';
import { Button } from "react-bootstrap";
import { ShoppingCartState, shoppingCartUpdaters } from "./shoppingCartState";
import { ShoppingProductsState } from "../products/productsState";
import { Updater } from "../../../widgets-extras";
import { shoppingCartLayout } from "./shoppingCartLayout";

export const shoppingCartWidget = 
  (shoppingCart:ShoppingCartState, productsState:ShoppingProductsState) : Widget<Updater<ShoppingCartState>> =>  
  fromJSX<Updater<ShoppingCartState>, never>(setState =>
  <>
    <shoppingCartLayout.yourCart />
    {
      shoppingCart.products
        .map((amount, productId) => {
          let product = productsState.products.get(productId)
          if (product == undefined) return <></>
          else return <>
            <shoppingCartLayout.product 
              product={product} 
              amount={amount}
              onMinusClick={() => setState(shoppingCartUpdaters.decreaseOrRemoveProduct(productId))}
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
  </>).wrapHTML(shoppingCartLayout.sticky)
