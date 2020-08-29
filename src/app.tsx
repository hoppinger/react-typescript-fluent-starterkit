import React from 'react';

import * as Component from "./component"
import { stateful, fromJSX } from 'widgets-for-react'
import { PrimaryButton, Stack, Label, Spinner, IStackProps, SpinnerSize } from '@fluentui/react'

const rowProps: IStackProps = { horizontal: true, verticalAlign: 'center' };
  const tokens = {
    sectionStack: {
      childrenGap: 10,
    },
    spinnerStack: {
      childrenGap: 20,
    },
  };
  
let hello_world_app =
  stateful<string>()(state =>
    fromJSX(setState => 
      <>
        <h1>{state}</h1>
        { Component.test() }
        <PrimaryButton text={"Button"} />
        <Stack tokens={tokens.sectionStack}>
          <Stack {...rowProps} tokens={tokens.spinnerStack}>
            <Label>Extra small spinner</Label>
            <Spinner size={SpinnerSize.xSmall} />
          </Stack>

          <Stack {...rowProps} tokens={tokens.spinnerStack}>
            <Label>Small spinner</Label>
            <Spinner size={SpinnerSize.small} />
          </Stack>

          <Stack {...rowProps} tokens={tokens.spinnerStack}>
            <Label>Medium spinner</Label>
            <Spinner size={SpinnerSize.medium} />
          </Stack>
        </Stack>

      </>
    )
  )("Hello world!!!")

export const App = () =>
  hello_world_app.run(state => 
    console.log("New state: ", state))
