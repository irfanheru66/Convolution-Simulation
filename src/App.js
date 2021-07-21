import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { Button, Form, Card, Container, Col, Row, Image, Navbar } from 'react-bootstrap';
import Home from './components/Home';
import Reduction from './components/Reduction';
import EdgeDetection from './components/EdgeDetection';
import HighPass from './components/HighPass';


function App() {
  return (
    <Router>
      <div className="App">
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Home></Home>
            </Route>
            <Route exact path="/noise-reduction">
              <Reduction></Reduction>
            </Route>
            <Route exact path="/edge-detection">
              <EdgeDetection></EdgeDetection>
            </Route>
            <Route exact path="/high-pass">
              <HighPass></HighPass>
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
