# Doing
[ ] implement page transitions with React transition group
[ ] about us page
  [ ] what we stand for
    [ ] happy picture
    [ ] bit of text
  [ ] our team
    [ ] mock "team" API
      [ ] actual pictures
    [ ] "Meet the team" header
    [x] spinner when loading
[ ] home 
  [ ] special offers with immediate "add to cart" button
  [ ] inspiring pictures of smiling people
[ ] responsiveness, especially of shopping cart
[ ] unique keys
[ ] shopping cart
  [ ] "payment" flow
[ ] integrate with _public site_
  [ ] login/registration from _public site_

[ ] restore home url to "/"
[ ] think of an epic name 
[ ] fully type-safe routes (requires 4.1)


# Widget library improvements
[ ] merge project with widget library
[ ] integrate widget-extras
[ ] fromJSX only needs one type argument
[ ] remove unused stuff:
  [ ] Form and Wizard from scaffolder
  [ ] remove div etc. from scaffolder
[ ] undeprecate router stuff
[ ] fix warning " > widgets-for-react@1.7.1" has incorrect peer dependency "react-router-dom@4.x".
[ ] fix widget library router (componentDidMount instead of componentWillMount warning)
[ ] fix widget library wait (componentWillReceiveProps)
[ ] add .withOptions instead of currying to inject options into the various widget combinators


# Make it production ready?
[ ] scaffold with new scaffolder and new admin interface and replace placeholder API
[ ] product page
  [ ] variants
  [ ] options
  [ ] locations/shops
    [ ] delivery vs pickup (for restaurant-type clients)
[ ] translations
[ ] micro-copy
[ ] multi-language
[ ] options, option groups, and product categories
[ ] multi-tenancy, roles and rights
[ ] simulated payment provider
[ ] actual payment provider
[ ] billing
[ ] server-side strip dangerous tags from product descriptions (they are set as HTML)
[ ] discounts
[ ] 404 route
[ ] deploy
  [ ] streamline deployment
[ ] integrate with BC
[ ] integrate with Sentry
[ ] guidelines for C#/backend development

# Advanced stuff for the future
[ ] use in-memory db
[ ] state builder: pages, db, transients, actions
[ ] lenses for state updaters


# Done
[x] implement animations from https://www.framer.com/motion/
[x] use `componentDidCatch` around some page which is broken on purpose
[x] Hoppinger e-commerce logo in header
[x] ironic footer with hipster text
[x] pagination of products
[x] e * w -> e + w
[x] apply theme
[x] client-side validation of form
[x] contact us form
[x] move state stuff to separate file(s)
[x] routeUpdates in stateUpdaters
[x] split navbar away from root files
[x] routes should never be repeated
[x] Action -> Updater
[x] routeBuilders should be more specific about the page they return
[x] Nav and Nav.Item, Nav.Link in separate file
[x] frontend framework
[x] switch on routes for main content
[x] move api stuff to separate file(s)
[x] readme and coding guidelines



# For reference\: tentative implementation of lenses
```ts
  // [ ] use builders instead of lambda's everywhere
  // [ ] `null`, `undefined`, and `null | x`/`undefined | x` types
  // [ ] unions and sums
  // [ ] collections
  //   [ ] lists
  //   [ ] arrays
  // [ ] nesting
  //   [ ] map^2
  //   [ ] list^2
  //   [ ] array^2
  //   [ ] option^2
  //   [ ] option . map
  //   [ ] option . list
  //   [ ] option . array
  //   [ ] option . union
  // [ ] actual implementation!
  // [ ] distinguish between set, insert field, remove field, and return a different type back
  //   [ ] this would work for nested operations only in case of a separate type, or where the same parameter is both input and output

type MapOperations<k,v> =
  { 
    insert:[k,v]
  } | {
    update:[k,LensUpdater<v>]
  } | {
    remove:k
  } | {
    removeIf:[k,Fun<v,boolean>]
  }

type OptionOperations<v> =
  { 
    insert:v | Option<v>
  } | {
    remove:Unit
  } | {
    update:LensUpdater<v>
  } | {
    removeIf:Fun<v,boolean>
  }

type LensUpdater<a> = 
  a extends number | boolean | string | null ?
    a | Updater<a>
  : a extends Map<infer k, infer v> ? 
    MapOperations<k,v> | Array<MapOperations<k,v>>
  : a extends Option<infer v> ? 
    OptionOperations<v>
  : Lens<a>

type NewValue<a, fieldKey extends keyof a> = 
  a[fieldKey] extends number | boolean | string | null ?
    a[fieldKey] | Updater<a[fieldKey]>
  : LensUpdater<a[fieldKey]>

export interface Lens<a> {
  (_:a): a,
  field: <fieldKey extends keyof a>(fieldKey:fieldKey, newValue:NewValue<a,fieldKey>) => Lens<a>,
}

export const Lens = <a, >() : Lens<a> => null!

type FlatEntity = { field1:number, field2:number }
type PolymorphicEntity = { kind:"kind1", field1:number, field2:number } | { kind:"kind2", field3:string, field4:string } | { kind:"kind3", field5:string, field6:string }
type State = 
  {
    field1:string
    field2:number
    field3:boolean
    optionField1:Option<FlatEntity>
    optionField2:Option<string>
    mapField1:Map<number,FlatEntity>
    mapOptionField1:Map<number, Option<FlatEntity>>
    // mapUnionField1:Map<number, PolymorphicEntity>
    // mapMapField1:Map<number, Map<string, { field1:number, field2:number }>>
    // arrayField1:Array<number>
    // arrayField2:Array<{ field1:number, field2:number }>
    // listField1:List<{ field1:number, field2:number }>
    // listMapField1:List<{ field1:number, field2:boolean, field3:Map<string, { field1:number, field2:boolean }> }>
    // listOptionField1:List<Option<{ field1:number, field2:number }>>
    // listUnionField1:List<{ kind:"kind1", field1:number, field2:number } | { kind:"kind2", field3:string, field4:string } | { kind:"kind3", field5:string, field6:string }>
  }

const stateUpdaters = 
  Lens<State>()
    // change the value of field1 to "new value"
    .field("field1", "new value")
    // change the value of field2 to 101
    .field("field2", 101)
    // flip the value of field3: true => false, false => true
    .field("field3", b => !b)
    // insert (1,{ field1:1, field2:2 }) into mapField1
    .field("mapField1", { insert:[1,{ field1:1, field2:2 }] })
    .field("mapField1", 
    [
        // field1 becomes 1 at mapField1[1]
        { update:[1, Lens<FlatEntity>().field("field1", 1)] },
        // field1 becomes 2 at mapField1[2]
        { update:[2, Lens<FlatEntity>().field("field1", 2)] },
        // field2 is incremented by 1 at mapField1[3]
        { update:[3, Lens<FlatEntity>().field("field2", x => x + 1)] },
        // field2 is doubled at mapField1[4]
        { update:[4, Lens<FlatEntity>().field("field2", x => x * 2)] },
        // mapField1[5] is removed
        { remove:5 },
        // mapField1[6] is removed if its field1 is greater than its field2
        { removeIf:[6, v => v.field1 > v.field2] }
      ] )
    // optionField1 is set to none() if its field1 is negative 
    .field("optionField1", { removeIf:v => v.field1 < 0 })
    // optionField1.v.field2 is set to 200 if present
    .field("optionField1", { update:Lens<FlatEntity>().field("field2", 200) })
    // optionField1.v.field1 is incremented by 1 if present
    .field("optionField1", { update:Lens<FlatEntity>().field("field1", x => x + 1) })
    // mapOptionField1[1] becomes some({ field1:0, field2:0 })
    .field("mapOptionField1", { insert:[1, some({ field1:0, field2:0 })] })
    // mapOptionField1[1] becomes none if its field1 is negative, and it remains in the Map
    .field("mapOptionField1", { update:[1, { removeIf:v => v.field1 < 0 }] })
    // mapOptionField1[1] gets removed from the map if it is none
    .field("mapOptionField1", { removeIf:[1, v => v.v.kind == "l"] })
    // mapOptionField1[1], if present in the map, becomes some({ field1:0, field2:10 })
    .field("mapOptionField1", { update:[1, { insert:{ field1:0, field2:10 } }] })
    // mapOptionField1[1], if present in the map, and if it is not none, gets field1 incremented and field2 doubled
    .field("mapOptionField1", { update:[1, { update:Lens<FlatEntity>().field("field1", x => x + 1).field("field2", x => x * 2) }] })

const newState = () : State => stateUpdaters(null!)
```