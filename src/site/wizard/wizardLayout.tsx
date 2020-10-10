import { Action, any, browserRouter, fromJSX, IOWidget, link, notFoundRouteCase, route, routerSwitch, stateful, Unit, Widget } from "widgets-for-react"
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom"
import { PrimaryButton, Stack, Label, Spinner, IStackProps, SpinnerSize } from '@fluentui/react'
import { ensureHTML, StandardWidget, Updater } from "../../widgets-extras"
import { wizardStateUpdaters, WizardState } from "./wizardState";
import { WizardRenderingWrappers } from "./wizardWidget";

export const defaultWizardRenderingWrappers:WizardRenderingWrappers = {
  root:html => 
    <Stack>
      {html}
    </Stack>
}
