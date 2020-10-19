import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export const rootLayout = {
  page:(html:JSX.Element) => 
  <Container fluid>
    <Row>
      <Col>
        {html}
      </Col>
    </Row>
  </Container>

}