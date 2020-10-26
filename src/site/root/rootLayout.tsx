import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export const rootLayout = {
  page:(html:JSX.Element) => 
    <div style={{ minHeight:"1000px" }}>
      <Container fluid>
        <Row>
          <Col>
            {html}
          </Col>
        </Row>
      </Container>
    </div>
}
