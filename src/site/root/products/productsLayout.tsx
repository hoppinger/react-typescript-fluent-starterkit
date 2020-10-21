import React from 'react';
import { Form, Button, Container, Row, Col, Spinner, Jumbotron, InputGroup, CardDeck, CardColumns } from "react-bootstrap";
import { ValidationResult } from '../../../shared';

export const productsLayout = ({
  loading: (props:{}) =>
  <Jumbotron fluid>
    <Container>
      <h1>Loading products</h1>
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </Container>
  </Jumbotron>,
  withLoader:(html:JSX.Element) =>
    <>
      {html}
      <productsLayout.loading />
    </>,
  cardColumns:(html:JSX.Element) =>
    <CardColumns>
      {html}
    </CardColumns>
})
