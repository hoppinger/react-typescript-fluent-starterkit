import React from 'react';
import { Form, Button, Container, Row, Col, Spinner, Jumbotron, InputGroup } from "react-bootstrap";
import { ValidationResult } from '../../../shared';
import { motion } from "framer-motion";

export const ContactUsLayout = ({
  FormItemInGroup: (props:{ 
    name:string, 
    controlId:string, 
    type:string,
    rows?:number,
    as?:React.ElementType,
    value:string,
    onChange:(_:string) => void,
    validation:ValidationResult
    children?:JSX.Element|Array<JSX.Element> 
  }) : JSX.Element => 
    <Form.Group controlId={props.controlId}>
      <Form.Label>{props.name}</Form.Label>
      <Form.Control type={props.type} as={props.as} rows={props.rows}
        value={props.value}
        isValid={props.validation.kind == "valid" ? true : undefined}
        isInvalid={props.validation.kind == "invalid" ? true : undefined}
        onChange={(e => props.onChange(e.currentTarget.value))}/>
      { props.validation.kind == "invalid" ?
          <Form.Control.Feedback type="invalid">
            {props.validation.error}
          </Form.Control.Feedback>
        : <Form.Control.Feedback type="valid" /> }
    </Form.Group>,
  ThankYou: (props:{}) =>
    <Jumbotron fluid>
      <Container>
        <h1>Thank you for your feedback</h1>
        <p>
          We use your feedback to improve!
        </p>
      </Container>
    </Jumbotron>,
  Spinner: (props:{}) =>
    <Spinner animation="border" role="status">
      <span className="sr-only">Submitting...</span>
    </Spinner>,
  LittleJumpAnimation:(html:JSX.Element) =>
    <motion.div animate={{
      scale: [1, 0.95, 1]
    }}
    transition={{ duration: 0.3 }}
    >
      {html}
    </motion.div>
      
})
