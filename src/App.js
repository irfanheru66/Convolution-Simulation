import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import Home from './components/Home';
import Reduction from './components/Reduction';
import EdgeDetection from './components/EdgeDetection';
import OtherEffect from './components/OtherEffect';
import Sharpening from './components/Sharpening';
import WatchModal from './components/WatchModal';
import FeedbackModal from './components/FeedbackModal';


function App() {
  const [modalShow, setModalShow] = useState(false);
  const [modalFeedbackShow, setModalFeedbackShow] = useState(false);

  return (
    <Router>
      <div className="App">
        <div className="content">
          <AnimatePresence exitBeforeEnter onExitComplete={() => setModalShow(false)}>
            <Switch>
              <Route exact path="/">
                <Home></Home>
              </Route>
              <Route exact path="/noise-reduction">
                <Reduction setModalShow={setModalShow} setModalFeedbackShow={setModalFeedbackShow}></Reduction>
              </Route>
              <Route exact path="/edge-detection">
                <EdgeDetection setModalShow={setModalShow} setModalFeedbackShow={setModalFeedbackShow}></EdgeDetection>
              </Route>
              <Route exact path="/sharpening">
                <Sharpening setModalShow={setModalShow} setModalFeedbackShow={setModalFeedbackShow}></Sharpening>
              </Route>
              <Route exact path="/others">
                <OtherEffect setModalShow={setModalShow} setModalFeedbackShow={setModalFeedbackShow}></OtherEffect>
              </Route>
            </Switch>
          </AnimatePresence>
        </div>
        <WatchModal show={modalShow}
          onHide={() => setModalShow(false)}></WatchModal>
        <FeedbackModal show={modalFeedbackShow}
          onHide={() => setModalFeedbackShow(false)}></FeedbackModal>
      </div>
    </Router>
  );
}

export default App;
