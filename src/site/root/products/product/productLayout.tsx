import React from 'react';
import { Range } from 'immutable';
import { Form, Button, Card, Container, Row, Col, Spinner, Jumbotron, InputGroup, CardDeck, CardColumns } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { ProductInfo } from '../productsState';
import { motion } from 'framer-motion';

export type ProductCardProps = { product:ProductInfo, addProduct:() => void } 

export const productLayout = ({
  card:(props:ProductCardProps) =>
    <Card>
      <Card.Body>
        <Row>
          <Col lg="10">
            <Card.Title>{props.product.name}</Card.Title>
            <Card.Text>
              <span dangerouslySetInnerHTML={{ __html:props.product.description} } />
            </Card.Text>
          </Col>
          <Col lg="2">
            <img src={props.product.imageURL} width="64px" />
          </Col>
        </Row>
        </Card.Body>
        <Card.Footer>
          <Row>
            <Col lg="10">
              <div>
                  {
                    Range(0, props.product.rating).map(_ => 
                      <span className="fa fa-star starChecked" />
                    ).toArray()
                  }
                  {
                    Range(props.product.rating, 5).map(_ => 
                      <span className="fa fa-star" />
                      ).toArray()
                    }
                </div>
            </Col>
            <Col lg="2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={_ => props.addProduct()}>
                <FontAwesomeIcon icon={faPlusCircle} />
                <span>{` ${props.product.price}`}€</span>
              </motion.button>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
})
