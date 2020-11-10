import React, { ErrorInfo } from "react";
import { Container, Row, Col } from "react-bootstrap";

export const rootLayout = {
  page:(html:JSX.Element) => 
    <div style={{ minHeight:"1000px" }}>
      <Container fluid className="p-3">
        <Row>
          <Col>
            {html}
          </Col>
        </Row>
      </Container>
    </div>,
  error:(props:{ error:[Error,ErrorInfo]}) =>
    <>
    <h1>
      There was an error in the page.
    </h1>
    <h2>
      The name of the error is: {props.error[0].name}
    </h2>
    <p>
      The message of the error is: {props.error[0].message}
    </p>
  </>

}
