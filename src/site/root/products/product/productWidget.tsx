import { any, async, fromJSX, IOWidget, Unit, Widget } from "widgets-for-react"
import React from 'react';
import { StandardLocalWidget } from "../../../../widgets-extras";
import { ProductId, ProductInfo, ProductsState, ShoppingProductsState } from "../productsState";
import { ProductCardProps, productLayout } from "./productLayout";

const MemoizedProductCard = React.memo((props: ProductCardProps) => 
  <productLayout.card key={props.product.productId} product={props.product} addProduct={props.addProduct} />,
  (prev, curr) => prev.product == curr.product)

export const productWidget = 
  (products:ShoppingProductsState) => (product:ProductInfo) : Widget<"add to cart"> => 
  fromJSX(setState =>
    <MemoizedProductCard product={product} addProduct={() => setState("add to cart")} />
  )
