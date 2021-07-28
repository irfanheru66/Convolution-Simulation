import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import Home from './components/Home';
import Reduction from './components/Reduction';
import EdgeDetection from './components/EdgeDetection';
import HighPass from './components/Sharpening';
import OtherEffect from './components/OtherEffect';
import Sharpening from './components/Sharpening';


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
            <Route exact path="/sharpening">
              <Sharpening></Sharpening>
            </Route>
            <Route exact path="/others">
              <OtherEffect></OtherEffect>
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
