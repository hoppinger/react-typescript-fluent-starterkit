# Doing
[ ] readme and coding guidelines

[ ] logo in header
[ ] footer
  [ ] inside <footer> tag, navbar with sticky-bottom class
  [ ] move to layout
[ ] shopping cart
  [ ] shopping cart icon with number of items top-right
  [ ] "payment" flow
[ ] login/registration from _public site_
[ ] home with special offers
[ ] responsiveness, especially of shopping cart
[ ] restore home url to "/"
[ ] implement animations from https://www.framer.com/motion/
[ ] implement page transitions with React transition group
[ ] remote and deferred validation of contact-us form
[ ] unique keys

[ ] use lenses (without commit!) on all stateUpdaters
  [ ] regular states
  [ ] within maps, lists, arrays, etc.
  [ ] inside discriminated unions

[ ] think of an epic name
[ ] fully type-safe routes


# Widgets improvements
  [ ] fromJSX only needs one type argument
  [ ] remove Form and Wizard from scaffolder
  [ ] remove div etc. from scaffolder
  [ ] undeprecate router stuff
  [ ] fix warning " > widgets-for-react@1.7.1" has incorrect peer dependency "react-router-dom@4.x".
  [ ] fix widget library router (componentDidMount instead of componentWillMount warning)
  [ ] fix widget library wait (componentWillReceiveProps)
  [ ] add .withOptions instead of currying to inject options into the various widget combinators


# Make it production ready?
  [ ] scaffold with new scaffolder and new admin interface and replace placeholder API
  [ ] options, option groups, and product categories
  [ ] multi-tenancy, roles and rights
  [ ] payment provider
  [ ] billing
  [ ] server-side strip dangerous tags from product descriptions (they are set as HTML)
  [ ] discounts


# Science fiction
[ ] use in-memory db
[ ] state builder: pages, db, transients, actions


# Done
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

