import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom"
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faHeart, faCoffee, faCopyright } from '@fortawesome/free-solid-svg-icons'

export const HeaderAndFooterLayout = {
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
    <Nav variant="tabs" className="mr-auto">{innerHtml}</Nav>,
  Footer:() =>
    <footer>
      <Navbar bg="dark" variant="dark" sticky="bottom" style={{ height:"100px" }}>
        <Nav>
          <Navbar.Text>
            Made with 
            <FontAwesomeIcon icon={faHeart} className="ml-2 mr-2" />
            and 
            <FontAwesomeIcon icon={faCoffee} className="ml-2 mr-2" />
            in Rotterdam.
          </Navbar.Text>
          <Navbar.Text className="float-right">
            <FontAwesomeIcon icon={faCopyright} className="ml-2 mr-2" />
            Hoppinger Group.
          </Navbar.Text>
        </Nav>
      </Navbar>    
    </footer>,
  Logo:(props:{ onClick:() => void }) =>
    <img 
      onClick={_ => props.onClick()}
      style={{ cursor:"pointer" }}
      src="images/triangleBusiness.svg" 
      width="35px" 
      height="35px" 
      className="mt-1 ml-1" />,
}
