import { List } from 'immutable';
import React from 'react';
import ReactDOM from 'react-dom';
import { root } from './site/root/rootWidget';

ReactDOM.render(root.run(s => 
  console.log("Here's the latest state:", s)), 
  document.querySelector('#root'))


type Product = { name:string, price:number }
type Category = { name:string, availableFor:"lunch"|"dinner", Products:List<Product> }
type Restaurant = { name:string, address:string, Categories:List<Category> }

const extractAllProducts = (restaurants:List<Restaurant>) : List<Product & { availableFor:"lunch"|"dinner" }> =>
  restaurants.flatMap(r => 
    r.Categories.flatMap(c =>
      c.Products.map(p => ({...p, availableFor:c.availableFor }))
    )
  )
