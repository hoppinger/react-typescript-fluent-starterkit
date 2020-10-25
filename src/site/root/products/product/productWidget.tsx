import { any, async, fromJSX, IOWidget, Unit, Widget } from "widgets-for-react"
import React from 'react';
import { StandardLocalWidget } from "../../../../widgets-extras";
import { ProductId, ProductInfo, ProductsState, ShoppingProductsState } from "../productsState";
import { productLayout } from "./productLayout";

export const productWidget = 
  (products:ShoppingProductsState) => (product:ProductInfo) : Widget<"add to cart"> => 
  fromJSX(setState =>
    <productLayout.card key={product.productId} product={product} addProduct={() => setState("add to cart")} />
  )
