# Guidelines

**A TypeScript and React project is well structured so that functionality is easy to find and always structured in the same way.**

This means that components are distributed into folders, and each folder has a clear structure.

## Components
**Each folder contains one component. The folder has the name of the component.** 

A component is responsible for one logical unit of work. A component performs one core action, and might also perform some secondary actions.

Examples of components:
* navigation bar;
* root that dispatches the correct page depending on the current route;
* shopping cart;
* products list;
* _contact us_ form.

If a component needs to take care of multiple things at the same level, then we *split it*.

Splitting a component can be done horizontally or vertically.


### Horizontal splitting
Horizontal splitting means that a component grows large, for example the product catalogue both shows a list of products and a shopping cart.

The product catalogue is now too large, plus we want to use it as a standalone component at other places in the project and in other projects as well, without having to take the products list with us.

We thus remove the shopping cart from the product catalogue and make another component out of it that resides _at the same level_.


### Vertical splitting
The product catalogue shows individual cards for the products offered. 

These cards become too large, and make the logic of the product catalogue harder to follow. Moreover, we know that if we want to reuse the product catalogue again in another project, the dependency between product catalogue and individual products is too strong, so we want to make it easy to move the dependencies around with their parent.

We thus create a _nested_ component, the product, inside the product catalogue.

We do so by creating a sub\-folder for the nested component.


## Structure of a single component
A component contains different groups of code. These code groups perform different sets of actions around code.

There are four main groups in a component `X`, *each in its own source file*\:
* `XLayout.tsx`, for HTML structure and styling;
* `XState.ts`, for the state of the component and the updaters to the component;
* `XAPI.ts`, for the API calls related to the component;
* `XWidget.tsx`, for the data\-flow of the component.

The structure of the project at the time of writing (this might of course change!), is the following\:

```
┌ root
├ rootLayout.tsx
├ rootState.ts
├ rootWidget.tsx
├─┬	contactUs
│ ├ contactUsApi.ts
│ ├ contactUsLayout.tsx
│ ├ contactUsState.ts
│ └ contactUsWidget.tsx
│
├─┬ products
│ ├ productsApi.ts
│ ├ productsLayout.tsx
│ ├ productsState.ts
│ ├ productsWidget.tsx
│ └─┬ product
│   ├ productLayout.tsx
│   └ productWidget.tsx
│
└─┬ shoppingCart
  ├ shoppingCartLayout.tsx
  ├ shoppingCartState.ts
  └ shoppingCartWidget.tsx
```

### State file
**Everything we do is type safe.** 

This begins by defining a state which correctly defines the valid configuration of data as a type and the updaters that are valid on this type.


#### Type 
**The state of our applications is structured as a TypeScript type** in such a way that wrong data cannot be stored in the state without a compiler error or making use of `any`.

For example, consider the following state, which is not well\-defined\:

```ts
type OrderState = {
  selectedRestaurantId?:number,
  deliveryAddress?:Address,
  restaurant:AsyncState<Restaurant>,
  products:AsyncState<Product[]>,
  selection:SelectedProduct[]
}
```

Why is `selectedRestaurantId` optional? Would you be able to guess?

> _Spoiler alert:_ when it is `undefined`, it means that we have selected a delivery restaurant, whereas when it is not `undefined`, then we have selected a take\-away restaurant. The opposite is true for `deliveryAddress`.

No you wouldn't, because it is not documented anywhere, and only by inspecting the code that uses this state can you guess the meaning.


**We use union types to partition our state into a series of mutually exclusive sub\-states** that have to do with how data transforms over the page. For example, we could say that the previous state might be refactored as follows\:

```ts
type OrderState = {
  kind:"take-away",
  selectedRestaurantId:number,
  restaurant:AsyncState<Restaurant>,
  products:AsyncState<Product[]>,
  selection:SelectedProduct[]
} | {
  kind:"delivery",
  deliveryAddress:Address,
  restaurant:AsyncState<Restaurant>,
  products:AsyncState<Product[]>,
  selection:SelectedProduct[]
} 
```

Now the `kind` also acts as documentation, and the fields are grouped so that we know which fields come together, and which do not. Unfortunately, there still is some repetition in the definition of `restaurant` and `products`.

**We use unions and intersections to reduce repetition when needed**. By grouping the same field groups, and giving a name to the type, we can simplify our state definition, and make it easier to change the shared payload\:

```ts
type RestaurantData = {
  restaurant:AsyncState<Restaurant>,
  products:AsyncState<Product[]>,
  selection:SelectedProduct[]
}

type OrderState = ({
  kind:"take-away",
  selectedRestaurantId:number,
} | {
  kind:"delivery",
  deliveryAddress:Address,
}) & RestaurantData
```

This is better, but still\: we cannot start filling up the `selection` until both API calls, `restaurant` and `products`, have succesfully completed. Moreover, we do not want to carry the `AsyncState` any instant longer than we need to\:

```ts
type RestaurantData = {
  kind:"loading",
  restaurant:AsyncState<Restaurant>,
  products:AsyncState<Product[]>
} | { 
  kind:"shopping",
  restaurant:AsyncState<Restaurant>,
  products:OrderedMap<ProductId, Product>,
  categories:OrderedMap<CategoryId, Category>,
  selection:SelectedProduct[]
}
```

Note that we are now splitting the loading of data, and the transactions that happen after the data has been loaded. Moreover, we also added some extra formatting to the loaded state that makes our lives easier.

The data contained in each sub\-state more closely reflects what can be done in that sub\-state\: the `selection` and the `categories` simply do not exist in the loading state, which makes sense because they just do not exist until we have loaded all data.

`products` and `categories` are stored inside an `OrderedMap`. This way, we can fetch products and categories by their id, instead of searching inside the arrays (which is slower and requires more complex code).

For an example of this, look at [the products state](../blob/master/src/site/root/products/productsState.ts), and how we split the state into the `loading` and `shopping` sub\-states, with more fields that get "unlocked" when entering in the `shopping` sub\-state.


#### Initializer
**Each state file contains** an `initialState` field or function that initializes the state with the most logical initial values. For example, the state could be initialized to `loading`, and the API call might be fired up.

When the initializer requires some data, then it becomes a function that accepts that data as input.


#### Updaters
A state will need to be changed as a result of events. Consider the simple state of a shopping cart\:

```ts
export type ShoppingCartState = {
  products:OrderedMap<ProductId, number>
}
```

The shopping cart state is defined as an object that groups together the various event handlers. The event handlers all take as input one or more parameters, and return an `Updater<ShoppingCartState>` that knows how to apply that particular transformation to a `ShoppingCartState`. These updaters are *deferred*. This means that they accept all the parameters needed to know what to do to a `ShoppingCartState`, but they do not get the `shoppingCart` right away. That will happen later, when applying these changes to the right part of the application state\:


```ts
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
```

Note that these updaters also do perform some minor logic checks, in order to defensively apply the updater only in a way that is safe. For example, when decreasing the amount of a product to zero or less, then we also remote the product automatically. 

**In general, updaters are always safe to apply, and written defensively so that they never produce an invalid state.**



### API file
**A separate file contains all of the code needed to fetch, parse, and transform, data from remote sources.**

The results of an API call are formatted, so that they match the structure that is needed by the state.

**We do not trust anything that comes from a REST API.** Arrays of field data will be empty, fields will be missing, fields will have the wrong type, etc. Anything that can go wrong, will go wrong.

We make heavy use of validation checks when parsing the results. We skip anything that looks even remotely suspicious. We use `try-catch` whenever looking up data from arrays.

There is a clear barrier between the data that comes from the API, and which has type `any` (the only place where `any` is acceptable), and after parsing, data is guaranteed to have the right structure.

The API file is also responsible for turning the data into the structure that the state requires. We do not expose raw, unprocessed data directly coming from the API without cleaning it up first. For example, we will turn an array into a `Map` or an `OrderedMap`, we will group data in categories, flatten data with `flatMap`, and anything else that is needed to protect the main application from the details of how data is fetched.

For example, consider how we could define an API call for getting products by splitting it into:
* the direct API call, `getRawProducts`, that gives us an array back;
* a formatting function `formatProducts`, that turns the array into something more structured, such as a map;
* the final, cleaned up API function `loadProducts` that composes the two, abstracting the format of the original API response away so that the application does not need to worry about it.

```ts
const getRawProducts = () : Promise<Array<ProductInfo>> => ...

const formatProducts = (products:Array<ProductInfo>) : OrderedMap<ProductId, ProductInfo> =>
  OrderedMap(products.map(pi => [pi.productId, pi]))

export const loadProducts = () : AsyncState<OrderedMap<ProductId, ProductInfo>> =>
  loadingAsyncState(() => 
    new Promise((res,rej) => setTimeout(() => {
      getRawProducts().then(products => 
        res({ kind:"result", value:formatProducts(products), status:200 })
      )
    }, 250)))
```



#### About `flatMap`
Sometimes, especially when dealing with OData, we get data with more structure than we needed. In this case, we can remove (flatten) some of this structure away. For example, consider the scenario where we get restaurants, with nested categories, with nested products, but we want to extract all the products of all the categories of each restaurant. We can do this with some complexity added to it, or we can use `flatMap` to simply concatenate the results of the inner lambda as follows\:

```ts
type Product = { name:string, price:number }
type Category = { name:string, availableFor:"lunch"|"dinner", Products:List<Product> }
type Restaurant = { name:string, address:string, Categories:List<Category> }

const extractAllProducts = (restaurants:List<Restaurant>) : List<Product> =>
  restaurants.flatMap(r => 
    r.Categories.flatMap(c =>
      c.Products
    )
  )
```

Suppose we wanted to combine data from two levels, for example extract the products with the availability (lunch/dinner). `flatMap` is still quite useful, because we can use the parameters of the previous iterations to extract parent data\:

```ts
type Product = { name:string, price:number }
type Category = { name:string, availableFor:"lunch"|"dinner", Products:List<Product> }
type Restaurant = { name:string, address:string, Categories:List<Category> }

const extractAllProducts = (restaurants:List<Restaurant>) : List<Product & { availableFor:"lunch"|"dinner" }> =>
  restaurants.flatMap(r => 
    r.Categories.flatMap(c =>
      c.Products.map(p => ({...p, availableFor:c.availableFor }))
    )
  )
```

Of course, we can combine `flatMap` and `map` to only remove some layers in the hierarchy. There are no limits to how complex the pipelines built with `flatMap` can be, and thanks to their declarative nature they are slightly better at self\-documentation than corresponding loops, plus it has better integrated boundary checks than loops that do it manually.


#### The power of mocking
**We mock our API's, aggressively, in order to reduce development dependencies in our projects.** Moreover, we mock because by mocking we can clearly define what the application needs, and what formatting is required to the API result in order to provide the right format. *We use mocking as an abstraction mechanism*, so that we can build the logic of the application without worrying too much about what the API will ultimately produce.

Mocking also allows us to better test for delays and failures. It is easy to miss the requirement for a spinner or loader animation because when testing locally everything is very fast. At the same time it is easy to see how hardened our application is with respect to API failures, because locally on a good developer' machine all API calls always succeed. For this reason, we build our API mocks to be randomly slow, and to fail often.

We can build a mock API by invoking the `Promise` constructor manually, using `setTimeout` with a random timing in milliseconds (usually within a useful range), and failing with a given probability\:

```ts
const mockAPICall = () : Promise<...> =>
  new Promise((res,rej) => 
    setTimeout(() => 
      Math.random() > 0.85
        res(...)
      :
        rej(...),
      Math.random() * 500 + 150
    )
  )
```

This way, we can be assured that either retries or some other form of graceful failure are implemented, and that slow results are also handled properly by the application. Note that without mocking, this is far harder to test, and thus the chance that it will go wrong *in production* is much higher.


### Layout file
**We separate logic and presentation, aggressively, in order to reduce development dependencies in our projects.** Moreover, we separate logic and presentation because they represent two different sets of functionality that are only marginally related to each other, and as such do not need to get in each other' way.

We want to keep CSS developers free from the bothers related to state and API management, and we want to keep TypeScript developers free from the bothers related to markup and styling.

Finally, we want to keep our components easy to reuse within other projects, and as such easy to restyle without impacting the underlying logic and dataflow.

We use two main tools for this\:
* functional React components to encapsulate visual/markup code;
* `JSX.Element` wrappers to wrap data\-centric widgets within the desired markup.


#### Visually oriented functional components
Consider the renderer of a product card. The positioning of links, images, text, etc. Is quite articulated. Most of the code has very little to do with logic though. There is only a single button that adds the product to the cart, and we abstract this interaction away with a simple `addProduct:() => void` callback\:

```tsx
export const productLayout = ({
  card:(props:{ product:ProductInfo, addProduct:() => void }) =>
    <Card>
      <Card.Body>
        <Row>
          <Col lg="10">
            <Card.Title>{props.product.name}</Card.Title>
            <Card.Text>
              <span dangerouslySetInnerHTML={{ __html:props.product.description} } />
            </Card.Text>
          </Col>
          <Col lg="2">
            <img src={props.product.imageURL} width="64px" />
          </Col>
        </Row>
        </Card.Body>
        <Card.Footer>
          <Row>
            <Col lg="10">
              <div>
                  {
                    Range(0, props.product.rating).map(_ => 
                      <span className="fa fa-star starChecked" />
                    ).toArray()
                  }
                  {
                    Range(props.product.rating, 5).map(_ => 
                      <span className="fa fa-star" />
                      ).toArray()
                    }
                </div>
            </Col>
            <Col lg="2">
              <Button variant="primary" onClick={_ => props.addProduct()}>
                <FontAwesomeIcon icon={faPlusCircle} />
                <span>{` ${props.product.price}`}€</span>
              </Button> 
            </Col>
          </Row>
        </Card.Footer>
      </Card>
})
```

The consumer of this functional component is a widget which is responsible for the proper translation of the `addProduct` event into data that will further be consumed along the way\:

```tsx
export const productWidget = 
  (products:ShoppingProductsState) => (product:ProductInfo) : Widget<"add to cart"> => 
  fromJSX(setState =>
    <productLayout.card key={product.productId} product={product} addProduct={() => setState("add to cart")} />
  )
```

Notice that, should the product widget end up doing more complex logic, then neither the markup will get in the way of this logic, nor the logic will get in the way of further styling. Best of both worlds!

It could be that in some cases we want to add some markup *around* an existing widget, without impacting the code and logic of the widget of course. In this case, we define a wrapper such as this\:

```tsx
export const rootLayout = {
  page:(html:JSX.Element) => 
    <div style={{ minHeight:"1000px" }}>
      <Container fluid>
        <Row>
          <Col>
            {html}
          </Col>
        </Row>
      </Container>
    </div>
}
```

Which we then use as follows\:

```tsx
page(currentState).wrapHTML(rootLayout.page)
```

Thanks to `wrapHTML`, the logic of the `page` widget and the markup of the `page` layout are completely separated, and easier to work on at the same time.

Even better\: less merge conflicts and faster turn\-around time.


### Widget file
- stateless components
- what comes in, what goes out
- components with more than one output
- no `any`, anywhere


## Routing and pages
type safety
`shouldComponentUpdate` and `lastUpdate`


naming conventions
formatting guidelines
