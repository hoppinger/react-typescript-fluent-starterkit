import React from 'react';
import { Range } from 'immutable';
import { Form, Button, Card, Container, Row, Col, Spinner, Jumbotron, InputGroup, CardDeck, CardColumns } from "react-bootstrap";
import { string } from 'widgets-for-react';
import { ProductInfo } from '../products/productsState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faMinusCircle, faTimes, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

export const ShoppingCartLayout = ({
  Sticky:(html:JSX.Element) => 
    <div className="sticky-top" style={{ overflowY:"visible"} }>{html}</div>,
  YourCart:(props:{}) =>
    <h4 className="m-4">Your order:</h4>,  
  Product:(props:{ 
      product:ProductInfo, amount:number, 
      onMinusClick:() => void, onPlusClick:() => void, 
      onXClick:() => void }) =>
    <Row>
      <Col lg="1">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={_ => props.onMinusClick()} >
          <FontAwesomeIcon style={{ cursor:"pointer" }} icon={faMinusCircle} />
        </motion.button>
      </Col>
      <Col lg="1">{props.amount}</Col>
      <Col lg="1">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={_ => props.onPlusClick()} >
          <FontAwesomeIcon style={{ cursor:"pointer" }} icon={faPlusCircle} />
        </motion.button>
      </Col>
      <Col lg="6">{props.product.name}</Col>
      <Col lg="2">{props.product.price * props.amount}€</Col>
      <Col lg="1">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={_ => props.onXClick()}>
          <FontAwesomeIcon style={{ cursor:"pointer" }} icon={faTimes} />
        </motion.button>
      </Col>
    </Row>,
  ShoppingCartIcon:(props:{ total:number, onClick:() => void}) =>
  <div 
    style={ { position:"absolute", top:"5px", right:"15px", cursor:"pointer" }}
    onClick={_ => props.onClick()}>
    <FontAwesomeIcon icon={faShoppingCart} size="2x"/>
    <div className="rounded text-center" 
      style={ { position:"absolute", top:"5px", right:"2px", backgroundColor:"white", 
      minWidth:"1.5em", fontSize:"10px" }}>
      {props.total}
    </div>
  </div>
})
