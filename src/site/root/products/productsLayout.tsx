import React from 'react';
import { Range } from "immutable"
import { Pagination, Form, Button, Container, Row, Col, Spinner, Jumbotron, InputGroup, CardDeck, CardColumns } from "react-bootstrap";
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
    </Jumbotron>
  ,
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
    </Col>
  ,
  shoppingCartCol:(html:JSX.Element) =>
    <Col lg="4">
      {html}
    </Col>,
  row:(html:JSX.Element) =>
    <Row>
      {html}
    </Row>,
  paginator:(props:{ 
      jumpToFirst:() => void, 
      jumpToPrev:() => void, 
      jumpToNext:() => void, 
      jumpToLast:() => void, 
      jumpTo:(_:number) => void, 
      currentPage:number,
      lastPage:number

    }) =>
    <Pagination>
      <Pagination.First onClick={_ => props.jumpToFirst()} />
      <Pagination.Prev onClick={_ => props.jumpToPrev()} />

      { 
        props.currentPage >= 3 &&
          <Pagination.Ellipsis />                
      }
      {
        Range(Math.max(0, props.currentPage - 3), Math.min(props.currentPage + 3, props.lastPage + 1)).map(pageIndex => 
          <Pagination.Item 
            active={pageIndex == props.currentPage}
            onClick={_ => props.jumpTo(pageIndex)}>
            {pageIndex + 1}
          </Pagination.Item>
        )
      }
      { 
        props.lastPage - props.currentPage >= 3 &&
          <Pagination.Ellipsis />                
      }

      <Pagination.Next onClick={_ => props.jumpToNext()} />
      <Pagination.Last onClick={_ => props.jumpToLast()} />
    </Pagination>  
})
