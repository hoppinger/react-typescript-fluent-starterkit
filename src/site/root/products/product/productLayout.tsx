import React from 'react';
import { Range } from 'immutable';
import { Form, Button, Card, Container, Row, Col, Spinner, Jumbotron, InputGroup, CardDeck, CardColumns } from "react-bootstrap";
import { ProductInfo } from '../productsState';

export const productLayout = ({
  card:(props:{ product:ProductInfo, children?:JSX.Element }) =>
        <Card style={{ width: '36rem' }}>
          <Card.Body>
            <Container>
              <Row>
                <Col>
                  <Card.Title>{props.product.name}</Card.Title>
                  <Card.Text>
                    <span dangerouslySetInnerHTML={{ __html:props.product.description} } />
                  </Card.Text>
                  </Col>
                  <Col>
                    <img style={ { float:"right" }} src={props.product.imageURL} width="64px" />
                    <div style={ { clear:"right" }} />
                  </Col>
                </Row>
                <Row>
                  <Col>
                  {props.children}
                  </Col>
                  <Col>
                    <div style={ { float:"right" }} />
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
                    <div style={ { clear:"right" }} />
                  </Col>
                </Row>
              </Container>
          </Card.Body>
        </Card>
})
