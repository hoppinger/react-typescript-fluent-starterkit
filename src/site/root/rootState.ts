import { Action, any, browserRouter, fromJSX, IOWidget, link, notFoundRouteCase, route, routerSwitch, stateful, Unit, Widget } from "widgets-for-react"
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom"
import { PrimaryButton, Stack, Label, Spinner, IStackProps, SpinnerSize } from '@fluentui/react'
import { CurrentPage, StandardWidget, Updater } from "../../widgets-extras";
import { wizard } from "../wizard/wizardWidget";
import { WizardState } from "../wizard/wizardState";
import { Pages, routeUpdaters } from "./routes/routesState";

export type ProductId = number

export type Person = {
  name:string,
  surname:string
}
export const personUpdaters = {
  name:(newName:string) => (currentPerson:Person):Person => ({ ...currentPerson, name:newName }),
  surname:(newSurname:string) => (currentPerson:Person):Person => ({ ...currentPerson, surname:newSurname }),
}

export type State = {
  page:CurrentPage<Pages>,
  somethingElse:number
  wizard1:WizardState<Person>
}

export const stateUpdaters = {
  updateWizard1:(wizardStateUpdater:Updater<WizardState<Person>>) => 
    (currentState:State):State => ({...currentState, wizard1:wizardStateUpdater(currentState.wizard1)}),
  routes:routeUpdaters
}
