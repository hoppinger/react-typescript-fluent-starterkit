import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom"
import { Button, Container, Nav, Navbar } from 'react-bootstrap';

export const NavigationLayout = {
  Item:(props:{ title:string, href:string }) =>
    <Nav.Item>
      <Nav.Link href={props.href}>
        {props.title}
      </Nav.Link>
    </Nav.Item>,
  ItemLink:(props:{ title:string, to:string, isActive:boolean }) =>
    <Nav.Item>
      <Nav.Link active={props.isActive}>
        <Link to={props.to}>{props.title}</Link>
      </Nav.Link>
    </Nav.Item>,
  Nav:(innerHtml:JSX.Element) =>
    <Nav variant="tabs" className="mr-auto">{innerHtml}</Nav>
}
