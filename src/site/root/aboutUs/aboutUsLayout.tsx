import React from 'react';
import { Row, Col, Card, Container, Jumbotron, Spinner, CardDeck } from "react-bootstrap";
import { ValidationResult } from '../../../shared';
import { motion } from "framer-motion";
import { TeamMember } from './aboutUsState';
import { Range } from 'immutable';

export const aboutUsLayout = ({
  loading: (props:{}) =>
    <Jumbotron fluid>
      <Container>
        <h1>Loading team members</h1>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Container>
    </Jumbotron>
  ,
  teamMemberCard:(props:{ teamMember:TeamMember }) =>
    <Card>
      <Card.Body>
        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Card.Img src={props.teamMember.imageURL} />
        </motion.div>
      </Card.Body>
      <Card.Footer>
        <Card.Title>{props.teamMember.name}</Card.Title>
        <Card.Text>
          {props.teamMember.function}
        </Card.Text>
      </Card.Footer>
    </Card>
  ,
  teamMembersCards:(props:{ teamMembers:Array<TeamMember> }) =>
    <Row>
      <Col>
        {
          Range(0, props.teamMembers.length / 3 + props.teamMembers.length % 3 == 0 ? 1 : 2)
            .flatMap(i =>
              [
                <CardDeck className="p-3">
                  <aboutUsLayout.teamMemberCard teamMember={props.teamMembers[i * 3 + 0]} />
                  <aboutUsLayout.teamMemberCard teamMember={props.teamMembers[i * 3 + 1]} />
                  <aboutUsLayout.teamMemberCard teamMember={props.teamMembers[i * 3 + 2]} />
                </CardDeck>
              ]
          ).toArray()
        }
      </Col>
    </Row>

})
