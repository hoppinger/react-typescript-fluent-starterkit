import { any, async, fromJSX, IOWidget, onlyIf, Unit, wait } from "widgets-for-react"
import React from 'react';
import { StandardWidget, Updater } from "../../../widgets-extras";
import { LoadingProductsState, ProductId, ProductInfo, ProductsState, productsUpdaters } from "./productsState";
import { Form, Button, InputGroup } from "react-bootstrap";
import { productsLayout } from "./productsLayout";
import { validations } from "../../../shared";
import { productWidget } from "./product/productWidget";

export const loadingProductsWidget : IOWidget<LoadingProductsState, Updater<ProductsState>> = currentState =>
  async<Array<ProductInfo>>()(currentState.productsLoader).map(productsUpdaters.productsLoader)

export const productsWidget : StandardWidget<ProductsState> = currentState => 
  currentState.kind == "loading" ?
    loadingProductsWidget(currentState).wrapHTML(productsLayout.withLoader)
  :
    any<Updater<ProductsState>>()([
      onlyIf<Updater<ProductsState>>(currentState.renderUpTo < currentState.products.count(), 
        wait<Updater<number>>(20)(() => x => x + 20).map(productsUpdaters.renderUpTo)
      ),
      ...currentState
        .products.take(currentState.renderUpTo).valueSeq().map(p =>
          productWidget(currentState)(p).never<Updater<ProductsState>>()
        ).toArray()
    ]) //.wrapHTML(productsLayout.cardColumns)