import { any, async, fromJSX, inl, inr, IOWidget, onlyIf, Unit, wait } from "widgets-for-react"
import React from 'react';
import { DoubleUpdater, shouldComponentUpdate, StandardLocalGlobalWidget, StandardLocalWidget, Updater } from "../../../widgets-extras";
import { LoadingProductsState, ProductId, ProductInfo, ProductsState, productsUpdaters } from "./productsState";
import { productsLayout } from "./productsLayout";
import { validations } from "../../../shared";
import { productWidget } from "./product/productWidget";
import { OrderedMap } from "immutable";
import { ShoppingCartState, shoppingCartUpdaters } from "../shoppingCart/shoppingCartState";
import { shoppingCartWidget } from "../shoppingCart/shoppingCartWidget";
import { State } from "../rootState";
import { shoppingCartLayout } from "../shoppingCart/shoppingCartLayout";

export const loadingProductsWidget : IOWidget<LoadingProductsState, Updater<ProductsState>> = currentState =>
  async<OrderedMap<ProductId, ProductInfo>>()(currentState.productsLoader).map(productsUpdaters.productsLoader)

export const productsWidget = (lastUpdate:State["lastUpdate"]) : StandardLocalGlobalWidget<ShoppingCartState, ProductsState> => ([shoppingCart,currentState]) => 
  currentState.kind == "loading" ?
    loadingProductsWidget(currentState)
      .wrapHTML(productsLayout.withLoader)
      .map(_ => inr(_))
  :
    any<DoubleUpdater<ShoppingCartState, ProductsState>>()([
      shouldComponentUpdate<DoubleUpdater<ShoppingCartState, ProductsState>>(lastUpdate != "shopping cart",
        any<DoubleUpdater<ShoppingCartState, ProductsState>>()([
          onlyIf<DoubleUpdater<ShoppingCartState, ProductsState>>(currentState.renderUpTo < currentState.productsPerPage, 
            wait<Updater<number>>(5, { key:"renderUpTo updater" })(() => x => x + 5).map(productsUpdaters.renderUpTo)
              .map(_ => inr(_))
          ),
          ...currentState.products
            .skip(currentState.currentPage * currentState.productsPerPage)
            .take(currentState.renderUpTo)
            .valueSeq()
            .map(p => 
              productWidget(currentState)(p)
                .map(_ => shoppingCartUpdaters.addProduct(p.productId))
                .map<DoubleUpdater<ShoppingCartState, ProductsState>>(_ => inl(_))
            ).toArray(),
          fromJSX(setState => 
            <productsLayout.paginator
              currentPage={currentState.currentPage}
              lastPage={currentState.lastPage()}
              jumpToFirst={() => setState(inr(productsUpdaters.currentPage(_ => 0)))}
              jumpToPrev={() => setState(inr(productsUpdaters.currentPage(_ => _ - 1)))}
              jumpTo={pageIndex => setState(inr(productsUpdaters.currentPage(_ => pageIndex)))}
              jumpToNext={() => setState(inr(productsUpdaters.currentPage(_ => _ + 1)))}
              jumpToLast={() => setState(inr(productsUpdaters.currentPage(_ => currentState.lastPage())))}
            />)
        ]).wrapHTML(productsLayout.productsCol)
      ),
      shouldComponentUpdate<DoubleUpdater<ShoppingCartState, ProductsState>>(true,
        any<DoubleUpdater<ShoppingCartState, ProductsState>>()([
          shoppingCartWidget(shoppingCart,currentState)
          .map(_ => inl(_))
        ]).wrapHTML(productsLayout.shoppingCartCol)
      )
    ]).wrapHTML(productsLayout.row)
