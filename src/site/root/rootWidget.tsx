import { any, browserRouter, fromJSX, IOWidget, link, notFoundRouteCase, route, routerSwitch, stateful, Unit, Widget } from "widgets-for-react"
import React from 'react';
import ReactDOM from 'react-dom';
import { Link, useHistory } from "react-router-dom"
import { PrimaryButton, Stack, Label, Spinner, IStackProps, SpinnerSize, CommandBar, Pivot, PivotItem } from '@fluentui/react'
import { StandardWidget, Updater } from "../../widgets-extras";
import { wizard } from "../wizard/wizardWidget";
import { Person, personUpdaters, ProductId, State, stateUpdaters } from "./rootState";
import { wizardStateUpdaters, WizardState, initialWizardState } from "../wizard/wizardState";
import { routeWidgets } from "./routes/routesState";

export const routes = () =>
  routerSwitch<Updater<State>>()([
    routeWidgets.home,
    routeWidgets.aboutUs,
    routeWidgets.products,
    routeWidgets.product,
    notFoundRouteCase<Updater<State>>(stateUpdaters.routes.home.jumpTo),
  ])

export const navigation:StandardWidget<State> = state =>
  fromJSX(_ =>
    <CommandBar 
      items={[
        { 
          key:"home",
          text:"home",
          checked:state.page.kind == "home",
          onClick:() => useHistory().push("/")
        },
        { 
          key:"about us",
          text:"about us",
          checked:state.page.kind == "aboutUs",
          onClick:() => useHistory().push("/about-us")
        },
        { 
          key:"products",
          text:"products",
          checked:state.page.kind == "products" || state.page.kind == "product",
          onClick:() => useHistory().push("/products")
        }
      ]}
    />
  )

export const personWizardWidget : StandardWidget<WizardState<Person>> = 
  currentState => 
    fromJSX(setState =>
      <>
        <input value={currentState.fields.name} 
          onChange={(e => 
            wizardStateUpdaters<WizardState<Person>>().fields(
              wizardStateUpdaters<Person>().fields(
                personUpdaters.name(e.currentTarget.value))))} />
        <input value={currentState.fields.surname} 
          onChange={(e => 
            wizardStateUpdaters<WizardState<Person>>().fields(
              wizardStateUpdaters<Person>().fields(
                personUpdaters.surname(e.currentTarget.value))))} />
      </>
    )

export const page:IOWidget<State, Updater<State>> = currentState =>
  any<Updater<State>>()([
    wizard(personWizardWidget, currentState.wizard1).map(stateUpdaters.updateWizard1),
    // wizard(currentState.wizard2).map(stateUpdaters.updateWizard2),
    fromJSX(setState => 
      <>
        <PrimaryButton>Button!!!</PrimaryButton>
      </>
    )
  ])


export const site = 
  browserRouter<State>()(
    stateful<State>()(currentState => 
      any<Updater<State>>()([
        routes(),
        navigation(currentState),
        page(currentState)
      ]).map(u => u(currentState))
    )({ page:{ kind:"home", params:{} }, somethingElse:0, wizard1:initialWizardState(3, { name:"", surname:"" }) })
  )
