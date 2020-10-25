import React from 'react';
import { Range } from 'immutable';
import { Form, Button, Card, Container, Row, Col, Spinner, Jumbotron, InputGroup, CardDeck, CardColumns } from "react-bootstrap";
import { string } from 'widgets-for-react';
import { ProductInfo } from '../products/productsState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faMinusCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

export const shoppingCartLayout = ({
  sticky:(html:JSX.Element) => 
    <div className="sticky-top" style={{ overflowY:"visible"} }>{html}</div>,
  yourCart:(props:{}) =>
    <h4 className="m-4">Your order:</h4>,  
  product:(props:{ 
      product:ProductInfo, amount:number, 
      onMinusClick:() => void, onPlusClick:() => void, 
      onXClick:() => void }) =>
    <Row>
      <Col lg="1">
        <FontAwesomeIcon style={{ cursor:"pointer" }} onClick={_ => props.onMinusClick()} icon={faMinusCircle} />
      </Col>
      <Col lg="1">{props.amount}</Col>
      <Col lg="1">
        <FontAwesomeIcon style={{ cursor:"pointer" }} onClick={_ => props.onPlusClick()} icon={faPlusCircle} />
      </Col>
      <Col lg="6">{props.product.name}</Col>
      <Col lg="2">{props.product.price * props.amount}€</Col>
      <Col lg="1">
        <FontAwesomeIcon style={{ cursor:"pointer" }} onClick={_ => props.onXClick()} icon={faTimes} />
      </Col>
    </Row>
})
