# Guidelines

A TypeScript and React project is split into folders. 

## Components
Each folder contains one component. A component is responsible for one logical unit of work. A component performs one core action, and might also perform some secondary actions.

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
A component contains different groups of code. These code groups are all 