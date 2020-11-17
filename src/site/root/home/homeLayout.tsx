import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom"
import { Jumbotron, Button, Container, Nav, Navbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faHeart, faCoffee, faCopyright } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion';

export const HomeLayout = {
  Welcome:(props:{ title:string }) =>
    <motion.div animate={{
        scale: [1, 0.95, 1]
      }}
      transition={{ duration: 0.3 }}
      >
      <Jumbotron fluid >
        <Container>
          <h1>{props.title}</h1>
        </Container>
      </Jumbotron>,
    </motion.div>
}
