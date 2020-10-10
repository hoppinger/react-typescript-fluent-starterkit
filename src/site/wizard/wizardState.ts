import { Updater } from "../../widgets-extras"

export type WizardState<Fields> = {
    fields:Fields
    step:number
    maxSteps:number
  }
export const initialWizardState = <Fields, >(maxSteps:number, initialFields:Fields) : WizardState<Fields> => 
  ({ step:0, maxSteps, fields:initialFields })

export const wizardStateUpdaters = <Fields, >() => ({
  fields:(fieldsUpdater:Updater<Fields>):Updater<WizardState<Fields>> => 
    currentWizardState =>
      ({ ...currentWizardState, fields:fieldsUpdater(currentWizardState.fields) }),
  prev:(currentWizardState:WizardState<Fields>):WizardState<Fields> => ({ ...currentWizardState, step:Math.max(0,currentWizardState.step-1) }),
  next:(currentWizardState:WizardState<Fields>):WizardState<Fields> => ({ ...currentWizardState, step:Math.min(currentWizardState.maxSteps, currentWizardState.step+1) })
})
