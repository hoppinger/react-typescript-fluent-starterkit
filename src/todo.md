# Doing
[ ] use lenses (without commit!) on all stateUpdaters
  [ ] use builders instead of lambda's everywhere
  [ ] `null`, `undefined`, and `null | x`/`undefined | x` types
  [ ] unions and sums
  [ ] collections
    [ ] lists
    [ ] arrays
  [ ] nesting
    [ ] map^2
    [ ] list^2
    [ ] array^2
    [ ] option^2
    [ ] option . map
    [ ] option . list
    [ ] option . array
    [ ] option . union
  [ ] actual implementation!
  [ ] distinguish between set, insert field, remove field, and return a different type back
    [ ] this would work for nested operations only in case of a separate type, or where the same parameter is both input and output


[ ] shopping cart
  [ ] "payment" flow
[ ] home with special offers
[ ] responsiveness, especially of shopping cart
[ ] restore home url to "/"
[ ] about us page
  [ ] make it pretty
[ ] integrate with _public site_
  [ ] login/registration from _public site_
[ ] implement animations from https://www.framer.com/motion/
[ ] implement page transitions with React transition group
[ ] remote and deferred validation of contact-us form
[ ] unique keys

[ ] think of an epic name
[ ] fully type-safe routes


# Widget library improvements
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
[ ] product page
  [ ] variants
  [ ] options
  [ ] locations/shops
    [ ] delivery vs pickup (for restaurant-type clients)
[ ] scaffold with new scaffolder and new admin interface and replace placeholder API
[ ] options, option groups, and product categories
[ ] multi-tenancy, roles and rights
[ ] payment provider
[ ] billing
[ ] server-side strip dangerous tags from product descriptions (they are set as HTML)
[ ] discounts
[ ] 404 route
[ ] deploy
  [ ] streamline deployment
[ ] integrate with BC
[ ] guidelines for C#/backend development
[ ] Sentry

# Advanced stuff for the future
[ ] use in-memory db
[ ] state builder: pages, db, transients, actions


# Done
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

