import React from 'react';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import MainPage from './MainPage';
import Auth from './Auth';

class App extends React.Component {
  constructor(props) {
    super(props);

  }


  render() {

    return (
      <Router>
        <Route path="/" exact component={Auth} />
        <Route path="/main" exact component={MainPage} />
      </Router>
    )


  }

}


export default App;
