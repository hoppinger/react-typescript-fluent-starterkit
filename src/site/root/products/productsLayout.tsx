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
  cardDeck:(html:JSX.Element) =>
    <CardDeck className="mt-3">
      {html}
    </CardDeck>,
  productsCol:(html:JSX.Element) =>
  <Col lg="8">
    {html}
    </Col>,
  shoppingCartCol:(html:JSX.Element) =>
    <Col lg="4">
      {html}
    </Col>,
  row:(html:JSX.Element) =>
    <Row>
      {html}
    </Row>,
})
