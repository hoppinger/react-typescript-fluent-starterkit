import { any, browserRouter, fromJSX, IOWidget, link, notFoundRouteCase, route, routerSwitch, stateful, Unit, Widget } from "widgets-for-react"
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom"
import { StandardWidget, Updater } from "../../widgets-extras";
import { wizard } from "../wizard/wizardWidget";
import { Person, personUpdaters, ProductId, State, stateUpdaters } from "./rootState";
import { wizardStateUpdaters, WizardState, initialWizardState } from "../wizard/wizardState";
import { routeUpdaters, routeWidgets } from "./routes/routesState";
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { navigation, routes } from "./routes/routesWidget";

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
        <Button>Button!!!</Button>
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
