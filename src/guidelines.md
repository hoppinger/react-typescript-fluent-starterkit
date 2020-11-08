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

**Not all components will feature all four main groups.** For example, a component might only have a state and an API that are used by multiple sub\-components, whereas another component might only feature widget and layout because it only performs rendering. For example, consider the situation where all state definitions and API calls for products are stored at the root level of the `Products` component (think about API's such as `createProduct`, `getAllProducts`, `addProductToFavorites`, etc.) and used throughout the whole hierarchy of product\-related sub\-components.


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

For an example of this, look at [the products state](./site/root/products/productsState.ts), and how we split the state into the `loading` and `shopping` sub\-states, with more fields that get "unlocked" when entering in the `shopping` sub\-state.


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


#### Why `Updater<State>` instead of just the new `State`?
Consider the case when a component is still processing something, for example a long API call or a `Promise` performing some background work. This component will then use the latest `State` that it either has in its `props` or in its closure, update it, and pass it on via a callback. And here's the issue! We now receive the old state with some minor change, but in the meantime it might be that other things changed concurrently because of other parts of the application.

Consider, in pseudo\-code, the following scenario\:

```
thread1 = s0 => setTimeout(return {...s0, x:s0.x+1}, 500)
thread2 = s0 => setTimeout(return {...s0, y:s0.y+1}, 200)
```

If we run both threads concurrently, then when `thread1` finishes, it will override the new value of `y` that was set by `thread2`, because `thread1` is still "stuck" on the old value of `s0` which is trapped in its closure.

What if both threads were to return an updater though?

```
thread1 = s0 => setTimeout(return s1 => {...s1, x:s1.x+1}, 500)
thread2 = s0 => setTimeout(return s1 => {...s1, y:s1.y+1}, 200)
```

Even if `thread1` finishes after `thread2`, because `thread1` gives back an updater, then it simply defers incrementing `x` to receiving the very latest state (which we now label `s1` so that we might even perform some diff analysis of `s0` vs `s1` to even stop the update if something big changed that makes the update irrelevant).

**Be careful\: while this might look like an avoidable complication of our code, failure to apply can cause some of the nastiest, least predictable and debuggable bugs imaginable.**


### API file
**A separate file contains all of the code needed to fetch, parse, and transform, data from remote sources.**

The results of an API call are formatted, so that they match the structure that is needed by the state.

**We do not trust anything that comes from a REST API.** Arrays of field data will be empty, fields will be missing, fields will have the wrong type, etc. Anything that can go wrong, will go wrong.

We make heavy use of validation checks when parsing the results. We skip anything that looks even remotely suspicious. There is a clear barrier between the data that comes from the API, and which has type `any` (the only place where `any` is acceptable), and after parsing, data is guaranteed to have the right structure.

If there is a good reason not to implement a more sophisticated parsing/validation of raw API data, at least use `try-catch` whenever doing something like looking up data from arrays that might be empty, or performing any other unsafe operation. In general, though, we use a more solid strategy. For each value of type `any` that comes from an API call, we perform the following\:
* check that each field is there;
* check that each field has the right type;
* (optional, only for unions) check that the field value is a valid entry in the union;
* recursively proceed with a sub\-check for each item of each array field.

We can automate a lot of this work though, so check if the existing utilities such as our own [`canSafelyCast`](./widgets-extras.ts) can help. [In our example](./site/root/products/productsApi.ts) you can see that we only need to declare a type\-safe (meaning that the compiler will guide you telling you which fields need what validators)\:

```ts
const productValidator:TypeCastingValidator<ProductInfo, keyof ProductInfo> = 
  {
    name:{ kind:"string" },
    description:{ kind:"string" },
    imageURL:{ kind:"string" },
    price:{ kind:"number" },
    productId:{ kind:"number" },
    rating:{ kind:"number", customValidationLogic:(rating:number) => rating >= 0 && rating <= 5 }
  }
```

and then just invoke it on untrusted values from the API\:

```ts
List(products)
  .map(v => canSafelyCast<ProductInfo>(productValidator, v))
  .flatMap(listFromOption))
```

This mechanism will ensure that all invalid items are at least filtered away, because those could wreak havoc on the stability of the application in components that apparently are not broken because they rely on type safety. For an even more complete and sophisticated approach, jump to our own [OData client](https://github.com/hoppinger/ts-odata-client/blob/master/src/odata/deserilisation.ts).

> Avoid silent errors. It is of course essential to guarantee that our applications work as best as they can, thus filtering away products that cannot be parsed might be a reasonable option, and certainly better than the whole site crashing and not a single product being shown. In case of errors though, it is important to also make sure that our _service_ people can act on it, thus consider logging an error message to the Sentry of your project.

The API file is also responsible for turning the data into the structure that the state requires. We do not expose raw, unprocessed data directly coming from the API without cleaning it up first. For example, we can turn an array into a `Map` or an `OrderedMap`, we will group data in categories, flatten data with `flatMap`, and anything else that is needed to protect the main application from the details of how data is fetched.

> The format of the data required by the application, and whether or not to use arrays, maps, ordered maps, etc. is very application\-dependent. For example\:
> - if you need to store a series of things that you will only render, then an array is a simple and fast solution; 
> - if you need to find and update items based on their primary key often, then a `Map` is probably the best solution;
> - if you need to process the whole collection often, with a combination of `map`, `filter`, `reduce`, or `flatMap`, then `Immutable.List` might be a good fit.
> Make sure to spend a reasonable amount of time analysing the requirements of your application. The wrong choice can have significant impact on performance and maintainability, and a refactor can be expensive or might even be postponed indefinitely.

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

> Whenever rendering `Immutable.X` collections, **remember to use `.ToArray()`**\: React cannot render `Immutable.X` natively, and must first be converted to arrays.


The consumer of this functional component is a widget which is responsible for the proper translation of the `addProduct` event into data that will further be consumed along the way\:

```tsx
export const productWidget = 
  (products:ShoppingProductsState) => (product:ProductInfo) : Widget<"add to cart"> => 
  fromJSX(setState =>
    <productLayout.card key={product.productId} product={product} addProduct={() => setState("add to cart")} />
  )
```

Notice that, should the product widget end up doing more complex logic, then neither the markup will get in the way of this logic, nor the logic will get in the way of further styling. Best of both worlds!

#### Wrapping markup
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
**The goal of a TypeScript and React application is to manage data.** Some of this data is generated by the application itself (user interactions), and some of this data is a temporary cache of "permanent" information from the database.

The goal of our client\-side applications is to manage this complex, asynchronous process. We should not underestimate the level of implicit complexity that is introduced by the concurrent nature of what we do. API calls, the users themselves, animations, are all concurrent sources of events that all compete for changing the state. A solid strategy for data management is essential.

We want to make sure that components are as independent from each other as possible. This means that components are merely stateless pipelines that\: 
* receive data as input (usually, the current state plus some extra parameters);
* draw the current state on the screen in the form of `JSX.Element` (think of a series of `map`, conditionals, etc.);
* activate some state updaters based on user or async events.

The typical shape of such a component will thus be\:

```ts
const myComponent = (currentState:ComponentState) : Widget<Updater<ComponentState>> =>
  any<Updater<ComponentState>>()([
    ... // all the sub components derived from the currentState
  ])
```

Sometimes, a component will invoke a sub\-component. In this case, the parent component uses the `map` function on the sub\-component to push the change of the sub\-state into the right piece. For example, the `shoppingCartWidget` has for output a `Updater<ShoppingCartState>`. This makes sense, because that is the only thing the `shoppingCartWidget` should want to update, and this way the `shoppingCartWidget` also stays easier to re\-use in the future, as long as its `ShoppingCartState` is somewhere to be found in the main application state.

```ts
shoppingCartWidget(currentState.shoppingCart)
  .map(stateUpdaters.updateShoppingCartState)
```

> Notice a neat detail. The type of `updateShoppingCartState` is `Updater<ShoppingCartState> => Updater<State>`. This means that `updateShoppingCartState` is capable of taking an update of a smaller part (the `ShoppingCartState`) and lift/embed it into the `State`. Thus, `map` can simply get as parameter `stateUpdaters.updateShoppingCartState` because it will automatically transform the output of `shoppingCartWidget`, namely an `Updater<ShoppingCartState>`, and turn it into the desired `Updater<State>`.

Signatures such as `(currentState:ComponentState) : Widget<Updater<ComponentState>>` are so common, that in this project it even gets a name\:

```ts 
export type StandardLocalWidget<s> = IOWidget<s, Updater<s>>
```


Sometimes, a widget might manipulate two states\: its own, main state, but also potentially another state. For example, a login widget that after login wants to redirect by changing the current route in the main state will have as primary (inner) state the `LoginState`, but as secondary (outer) state the `ApplicationState`. In this case, we can reuse our framework, but instead of taking as input a single state we take two, and instead of returning one `Updater`, we return either of two possible updaters.

The signatures that encapsulate this scenario are the following\:

```ts
export type DoubleUpdater<outerState, innerState> = Sum<Updater<outerState>, Updater<innerState>>

export type StandardLocalGlobalWidget<outerState, innerState> = 
  IOWidget<[outerState, innerState], DoubleUpdater<outerState, innerState>>
```

When a widget wants to return a right updater, then it needs to encapsulate it as follows\:

```ts
(w:Updater<innerState>).map(_ => inr(_)) : DoubleUpdater<outerState, innerState>
```

and the same applies to a left updater\:

```ts
(w:Updater<outerState>).map(_ => inl(_)) : DoubleUpdater<outerState, innerState>
```

The parent receiving a `DoubleUpdater` can dispatch it by using the `applyDoubleUpdater` utility as follows\:

```ts
productsWidget(currentState.lastUpdate)([currentState.shoppingCart, currentState.page.pageState])
  .map(updater => 
      applyDoubleUpdater(
        updater, 
        stateUpdaters.updateShoppingCartState, 
        stateUpdaters.updateProductsState))
```

`applyDoubleUpdater` will simply route the updater to the proper lifting/embedding function. Take a look at [the products widget](./site/root/products/productsWidget.ts) to see a widget with dual output (one for its own `ProductsState`, one for the external `ShoppingCartState`).


## Routing and pages
**Routing is done with type safety in the first place.** Each page is defined with its own type, containing a url definition (with both url and parameters for TypeScript to parse), and the local state of the page. For example, consider a website with five pages\:

```ts
export type Pages =
  {
    home:{ url:[] },
    products:{ url:["products"], pageState:ProductsState },
    aboutUs:{ url:["about-us"] }
    contactUs:{ url:["contact-us"], pageState:ContactUsState }
    product:{ url:["product", { productId : number }], pageState?:Unit }
  }
```

The type of the url's is, for now, just a tuple with the url strings and the parameters with their expected type. 

> It might be tempting to define a `pageState` that contains as much data as possible that is relevant for each current page. One might expect that this way the global state will remain smaller, and thus easier to manage. Unfortunately, caution is advisable. It happens very often that data which was only relevant for a page ultimately ends up being used a bit everywhere. Thus, even though one might expect advantages from over\-splitting, be careful, and whenever in doubt put a state in a field of the root state instead of inside a `pageState`.


Thanks to TypeScript' advanced types magic, the type of `Pages` can be automatically turned in a discriminated union by the `CurrentPage<Pages>` helper. Indeed, if you look at [the root state](./site/root/rootState.ts), you will see 

```ts
export type State = {
  page:CurrentPage<Pages>,
  ...
}
```

so that the conversion of `Pages` into a usable structure is taken care automatically for us.

> Note that starting from TypeScript 4.1 it will be possible for the url type to be a regular React route, but for now we have to accept this temporary compromise.

The next step is to define how the parameters of a parsed route are turned into an instance of a page to be stored in the state\:

```ts
export const routeBuilders:RouteBuilders<State,Pages> = {
  ...
  contactUs: {
    make: (params:PageParams<Pages["contactUs"]>) => 
      ({ kind:"contactUs", params:params, pageState:initialContactUsState })
    },
  products: {
    make: (params:PageParams<Pages["products"]>) => 
      ({ kind:"products", params:params, pageState:initialProductsState })
    }
}
```

In this example, there is barely any conversion done between `pageState` and `params`, but one could easily imagine that the `params` could be used to start up some API call (for example, in order to bootstrap an API call with the right parameters).

The route updaters are then defined based on the `routeBuilders`, which are then further used inside the React router. Note that all the types can be derived from the original type definition of `Pages`, leading to type safety and a higher degree of extensibility without errors. Check this out in action\: [routes state and updaters](./site/root/routes/routesState.ts) and [routes widget](./site/root/routes/routesWidget.ts).

Note that if you change the `Pages` type, a series of type errors will guide you to add all the extra updaters and widgets you need. The only thing you still need to do is add the actual route to `routes` in [routes widget](./site/root/routes/routesWidget.ts).


## Error handling
**Bugs happen. That's life. That is no excuse for uncatched exceptions.**
In some cases, React will react (haha!) to malformed DOM's in an extreme way, by showing the white screen of death (WSoD). In particular, errors such as mounting an object somewhere in the DOM will cause React to render nothing at all, and to not even display the slightest useful message.

This sort of bug is, simply put, inacceptable for our end users. Fortunately, React offers a lifecycle method, `componentDidCatch`, which is used to fallback when a child component misbehaves and produces an invalid DOM.

Yes, _there's a widget for that_. You can wrap a widget that might fail in a `componentDidCatch` higher order widget, and by doing so providing a key (that is very important to force a remount of `componentDidCatch`, otherwise it stays stuck in the error state) and an optional fallback widget to render the error.

You can put `componentDidCatch` around whatever you want, depending on what level of granularity is required in the project. 

**We do require for this to be present at least at the root level, or around the main page content, so that the WSoD will never happen.** Whether or not `componentDidCatch` is also used *more* is up to each project team.

> Also make sure that in the fallback we also send an error message to, for example, Sentry in order to get a warning so that our service team can get to work without waiting for customers to tell us themselves. Prevention is better than curing when it comes to bugs!

Jump to [the root widget](./site/root/rootWidget.tsx) to see an example of `componentDidCatch`.


## Performance considerations
React uses sophisticated, high performance heuristics to try and process visual updates in real time (60 frames per second). React is not perfect, and so we might need to use some tools to influence and guide this process so that performance is as snappy as it goes.


### Keys and reconciliation
In most cases, this performance is easy to achieve because the sheer amount of things that actually changed in the DOM are not many, even when the DOM is huge. This is only possible if the DOM is easy to reconcile, that is if all the elements of the DOM are marked with `key` properties so that React can quickly determine which elements should be reconciled with which elements. Without `key` properties, React must look at all the siblings with the same structure, which might cost a lot of time especially when dealing with a longer list.

This means that we must extensively use `key` properties in our React applications, and take React complaints about missing keys very seriously.

### `shouldComponentUpdate` and `React.memo`
> **Premature optimization is the root of all evil.** Before applying the content of this section, make sure to _thoroughly benchmark_ rendering time. This is harder to do than it looks. The simplest way to notice this is when button responses and UI updates become sluggish as the DOM grows in size, or if takes too long to render a large update such as right after an API call delivers lots of data to the page.

Sometimes, when a widget updates, we can exclude that other widgets might need to update as well. For example, when the shopping cart changes, we might want to reassure React that the huge element containing all the products and categories does not need to be updated at all. By offering React this binding advice we can save it a lot of work to reconcile elements in the DOM which did not change at all. 

> The guru says: "the fastest code to run is the code you do not execute."

An easy way to achieve this, is to save these hints in a field in the root state such as `lastUpdate`\:

```ts
export type State = {
  lastUpdate?:"shopping cart" | "products"
}
```

Each update of the root state can then conservatively set the `lastUpdate`\:

```ts
export const stateUpdaters = {
  updateContactUsState:(contactUsUpdater:Updater<ContactUsState>) => 
    (currentState:State):State => 
      ({...currentState, 
          ...
          lastUpdate:undefined
        }),
  updateShoppingCartState:(shoppingCartUpdater:Updater<ShoppingCartState>) => 
  (currentState:State):State => 
    ({...currentState, 
      ...,
      lastUpdate:"shopping cart"
    }),     
  updateProductsState:(productsUpdater:Updater<ProductsState>) => 
  (currentState:State):State => 
    ({...currentState, 
      ...
      lastUpdate:"products"
    }),     
  routes:routeUpdaters
}
```

We can then wrap the widget that renders the products inside a `shouldComponentUpdate` so that the big products widget can be skipped for all the updates that only have to do with the shopping cart. The shopping cart will then feel much snazzier\:

```ts
  any<DoubleUpdater<ShoppingCartState, ProductsState>>()([
    shouldComponentUpdate<DoubleUpdater<ShoppingCartState, ProductsState>>(lastUpdate != "shopping cart", productsWidget
    ),
    ...
  ]).wrapHTML(productsLayout.row)
```

> In general, there are numerous widgets (and those that are not can be easily built) such as `shouldComponentUpdate` that expose the React lifecycle. Make use of these widgets to achieve a more fine\-grained control over when things happen in your application.


A useful, and much simpler alternative can often be `React.memo`. `React.memo` performs a comparison between the previous and the next props of a functional component in order to prevent unnecessary rendering. You can even provide a custom comparison function to perform a domain\-specific comparison that is more accurate than the default shallow comparison that React would perform itself.

We define a memoized component that only rerenders when property `a` in the state changes as follows\:

```tsx
type State = { a:number, b:number }
const MemoizeA = React.memo((props: {state:State }) => 
  <>
    <h2>Memoized on a</h2>
    <div>a: {props.state.a}</div>
    <div>b: {props.state.b}</div>  
  </>, (prev, curr) => prev.state.a == curr.state.a)
```

The component can be used exactly as one would expect. This performance optimization can prevent re\-renders of functional components without having to implement `shouldComponentUpdate`, and thus might be a lightweight alternative that can unlock faster performance.

An example from our sample application is a wrapper around the product card. Notice that memoization, being part of state management, is widget, not layout work. This is an important aspect of separation of concerns\: we do not want layout and styling to be bothered by anything related to state and property management!

```tsx
const MemoizedProductCard = React.memo((props: ProductCardProps) => 
  <productLayout.card key={props.product.productId} product={props.product} addProduct={props.addProduct} />,
  (prev, curr) => prev.product == curr.product)

export const productWidget = 
  (products:ShoppingProductsState) => (product:ProductInfo) : Widget<"add to cart"> => 
  fromJSX(setState =>
    <MemoizedProductCard product={product} addProduct={() => setState("add to cart")} />
  )
```


### Streaming/batched rendering
Sometimes we might be temptedto render a large list in one go. If there are hundreds of products, contacts, or whatever else in a list though, adding all of those elements to the DOM in one go might take upwards of **seconds**, which can be awful for the performance perception.

> Ask Francesco how him and me spent _days_ optimizing an API call, to finally accept that the API was fast but rendering hundreds of products to the DOM took a full five seconds extra!

A simple trick to achieve this is to perform _streaming rendering_. We store in the state not only all the things we want to render, but also how many to render _right now_\:

```ts
export type ShoppingProductsState = {
  renderUpTo:number,
  products:OrderedMap<ProductId, ProductInfo>
  ...
}
```

When rendering the products (somewhere inside an `any`), we limit ourselves to `renderUpTo` with `take`\:

```ts
currentState.products
  .take(currentState.renderUpTo)
  .valueSeq()
  .map(p => 
    productWidget(currentState)(p)
  ).toArray()
```

We make sure that the initial value of `renderUpTo` is large enough that the user gets a screenful of products, but small enough that React can render it very quickly. Think 20-50 items, but of course experimentation is key to find the ideal answer here.

We finally add another widget that uses `wait` to increment `renderUpTo`, for example by 5, every 5 milliseconds. The user will barely notice that the scrollbar grows quickly, and React will only find 5 new items to add to the list at each iteration\:

```ts
onlyIf<DoubleUpdater<ShoppingCartState, ProductsState>>(
  currentState.renderUpTo < currentState.products.count(), 
  wait<Updater<number>>(5)(() => x => x + 5).map(productsUpdaters.renderUpTo)
)
```

Note that there's a widget that encapsulates this behavior\:

```ts
export const timedCounterTo = (currentValue:number, maxValue:number, updateDelay?:number) =>
  onlyIf<Updater<number>>(currentValue < maxValue, 
    wait<Updater<number>>(updateDelay || 5, { key:`timed counter updater` })(() => x => x + 5)
  )
```


## General hygiene conventions
We use `camelCase` for values and functions.

We use `PascalCase` for types.

We use `camelCase` for generic type parameters.

We use long and expressive names for everything. Expressive names contain for example both target and action (`productsUpdaters` is the object with all the updaters for the products widget(s)).

We prefer very short functions and one\-liners. Lambdas functions are preferred over long functions.

We compile with the strictes TypeScript options possible.

We split out TypeScript projects in sub\-projects to speed compilation times up.

We use very few npm packages. The usual suspects, `React`, `react router dom`, `immutable`, etc. are obviously accepted\: it would make no sense to rebuilt React ourselves. We actively reject tiny npm packages that only perform minor functionality. We only use packages from reputable parties such as large enterprises with a solid track record. We do not use packages built from tiny companies, where code is barely updated and maintained, or where the bus factor is lower than 50.

We absolutely do not use other DOM\-manipulation libraries that might conflict with React!

We use formatting guidelines as defined by each project team **in full consensus**. Hoppinger\-broad formatting guidelines will later appear, but this process will take a bit longer.



# Feedback to process
## Steven
- use this as the startup tutorial in the widget library
