import { any, async, fromJSX, IOWidget, Unit, Widget } from "widgets-for-react"
import React from 'react';
import { StandardWidget } from "../../../../widgets-extras";
import { ProductId, ProductInfo, ProductsState, ShoppingProductsState } from "../productsState";
import { Button } from "react-bootstrap";
import { productLayout } from "./productLayout";

export const productWidget = 
  (products:ShoppingProductsState) => (product:ProductInfo) : Widget<"add to cart" | "remove from cart"> => 
  fromJSX(setState =>
    <productLayout.card product={product}>
      <Button variant="primary">Add to cart</Button>
    </productLayout.card>
  )
