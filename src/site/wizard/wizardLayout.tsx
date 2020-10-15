import { any, browserRouter, fromJSX, IOWidget, link, notFoundRouteCase, route, routerSwitch, stateful, Unit, Widget } from "widgets-for-react"
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom"
import { ensureHTML, HTMLWrapper, StandardWidget, Updater } from "../../widgets-extras"
import { wizardStateUpdaters, WizardState } from "./wizardState";

export type WizardRenderingWrappers ={
  fields?:HTMLWrapper,
  navigationControls?:HTMLWrapper,
  root?:HTMLWrapper
}

export const defaultWizardRenderingWrappers:WizardRenderingWrappers = {
}

