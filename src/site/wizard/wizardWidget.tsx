import { Action, any, browserRouter, fromJSX, IOWidget, link, notFoundRouteCase, route, routerSwitch, stateful, Unit, Widget } from "widgets-for-react"
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom"
import { PrimaryButton, Stack, Label, Spinner, IStackProps, SpinnerSize } from '@fluentui/react'
import { ensureHTML, StandardWidget, Updater } from "../../widgets-extras"
import { wizardStateUpdaters, WizardState } from "./wizardState";
import { defaultWizardRenderingWrappers } from "./wizardLayout";

export const wizardNavigationControls = <Fields, >(currentWizardState:WizardState<Fields>) : Widget<Updater<WizardState<Fields>>> =>
  fromJSX(setState => 
    <>
      <PrimaryButton 
        disabled={currentWizardState.step <= 0} 
        onClick={e => setState(wizardStateUpdaters<Fields>().prev)}>Prev</PrimaryButton>
      <PrimaryButton 
        disabled={currentWizardState.step >= currentWizardState.maxSteps} 
        onClick={e => setState(wizardStateUpdaters<Fields>().next)}>Next</PrimaryButton>
    </>)

export type WizardRenderingWrappers ={
  fields?:Action<JSX.Element>,
  navigationControls?:Action<JSX.Element>,
  root?:Action<JSX.Element>
}

export const wizard = <Fields, >(
  fieldsWidget:StandardWidget<WizardState<Fields>>, 
  currentWizardState:WizardState<Fields>, 
  renderingWrappers?:WizardRenderingWrappers) : Widget<Updater<WizardState<Fields>>> =>
  any<Updater<WizardState<Fields>>>()([
    fieldsWidget(currentWizardState)
      .wrapHTML(ensureHTML((renderingWrappers || defaultWizardRenderingWrappers).fields)),
    wizardNavigationControls(currentWizardState)
    .wrapHTML(ensureHTML((renderingWrappers || defaultWizardRenderingWrappers).navigationControls)),
  ]).wrapHTML(ensureHTML((renderingWrappers || defaultWizardRenderingWrappers).root))
