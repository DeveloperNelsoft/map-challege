import React from 'react';
import Router from './route/index';
import { Container } from 'react-bootstrap';
import './App.css';

function App() {
  return (
      <Container fluid className="App">
          <Router />
      </Container>
  );
}

export default App;
