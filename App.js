import React from 'react';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import MainPage from './MainPage';
import Auth from './Auth';
import Constants from './Constants';
import Cookies from 'universal-cookie';
import $ from 'jquery';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { state: 0 };

  }
  componentDidMount() {

    const cookies = new Cookies();
    let token = cookies.get('token');
    if (token != undefined) {
      var self = this;
      $.ajax({
        type: 'POST',
        url: Constants.HOST+'/api/checkToken/',
        data: { token: token },
        success: function (jqXHR, textStatus, errorThrown) {
          if (jqXHR.response !== "false") {
            self.setState({ state: 1 });
          } else self.setState({ state: 2 });

        }
      });

    } else {
      this.setState({ state: 2 });
    }
  }

  render() {

    console.log(this.state.state);
    return (
      <div>
        {/* <h1>{'This will always render'}</h1> */}
        {this.state && this.state.state == 2 && <Auth/>}
        {this.state && this.state.state == 1 && <MainPage/>}        
      </div>
    )

    return (
      <div>
        {this.state.state === 0 ? <h1>loading</h1> : (this.state.state === 1 ? <MainPage /> : <Auth />)}
      </div>
    );

    {/* </Router>
    <div>
      {this.state.data === 0 ? 
          <div>Loading</div>
      : <div>{this.state.data}</div>
      }
  </div>); */}


    // return (
    // <Router>
    //   <Route path="/" exact component={Auth} />
    //   <Route path="/main" exact component={MainPage} />
    // </Router>
    // )


  }

}


export default App;
