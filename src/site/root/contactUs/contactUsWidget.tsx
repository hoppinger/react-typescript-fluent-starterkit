import { any, async, fromJSX, Unit } from "widgets-for-react"
import React from 'react';
import { StandardWidget, Updater } from "../../../widgets-extras";
import { ContactUsState, contactUsUpdaters, contactUsValidators } from "./contactUsState";
import { Form, Button, InputGroup } from "react-bootstrap";
import { contactUsWrappers } from "./contactUsLayout";

export const contactUsWidget : StandardWidget<ContactUsState> = currentState => 
  currentState.submission == undefined || currentState.submission.kind != "loaded" ?
    fromJSX((setState:(_:Updater<ContactUsState>) => void) =>
      <Form noValidate onSubmit={e => { e.preventDefault(); setState(contactUsUpdaters.submit()) } }>
          <contactUsWrappers.formItemInGroup 
            controlId="formName" name="name"
            type="text"
            value={currentState.name || ""}
            onChange={(newValue => setState(contactUsUpdaters.name(newValue)))}
            validation={contactUsValidators.name(currentState)}
          >
          </contactUsWrappers.formItemInGroup>
          <contactUsWrappers.formItemInGroup 
            key={`contactUsPhoneNumber`}
            controlId="formPhoneNumber" name="Phone number"
            type="text"
            value={currentState.phoneNumber || ""}
            onChange={(newValue => setState(contactUsUpdaters.phoneNumber(newValue)))}
            validation={contactUsValidators.phoneNumber(currentState)}
            >
          </contactUsWrappers.formItemInGroup>
          <contactUsWrappers.formItemInGroup 
            key={"contactUsEmail"}
            controlId="formBasicEmail" name="Email address"
            type="email"
            value={currentState.email || ""}
            onChange={(newValue => setState(contactUsUpdaters.email(newValue)))}
            validation={contactUsValidators.email(currentState)}
          >
          </contactUsWrappers.formItemInGroup>
          <contactUsWrappers.formItemInGroup 
            controlId="formSubject" name="Subject"
            type="text" 
            value={currentState.subject || ""}
            onChange={(newValue => setState(contactUsUpdaters.subject(newValue)))}
            validation={contactUsValidators.subject(currentState)}
          >
          </contactUsWrappers.formItemInGroup>
          <contactUsWrappers.formItemInGroup controlId="formBody" name="Body"
            type="text" 
            as="textarea" rows={5}
            value={currentState.body || ""}
            onChange={(newValue => setState(contactUsUpdaters.body(newValue)))}
            validation={contactUsValidators.body(currentState)}
          >
            <Form.Text className="text-muted">
              Let us know what you think
            </Form.Text>
          </contactUsWrappers.formItemInGroup>
          { submissionButton(currentState).run(setState) }
      </Form>
    )
  :
  fromJSX(_ =>
    <contactUsWrappers.thankYou />
  )

export const submissionButton : StandardWidget<ContactUsState> = currentState => 
  currentState.submission == undefined ?
    fromJSX(setState =>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    )
  :
    any<Updater<ContactUsState>>()([
      async<Unit>()(currentState.submission).map(u => contactUsUpdaters.submission(u)),
      fromJSX(_ => <contactUsWrappers.spinner />)
    ])
