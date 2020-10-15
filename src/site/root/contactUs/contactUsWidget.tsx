import { any, browserRouter, fromJSX, IOWidget, link, notFoundRouteCase, route, routerSwitch, stateful, Unit, Widget } from "widgets-for-react"
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom"
import { StandardWidget, Updater } from "../../../widgets-extras";
import { WizardState, wizardStateUpdaters } from "../../wizard/wizardState";
import { Person, personUpdaters } from "../rootState";

export const contactUs : StandardWidget<WizardState<Person>> = 
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
