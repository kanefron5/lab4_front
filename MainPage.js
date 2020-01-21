import React from 'react';
import Shapka from './shapka';
import Cookies from 'universal-cookie';
import $ from 'jquery';
import Constants from './Constants';
import Canvas from './Canvas';
import './App.css';


class MainPage extends React.Component {
  constructor(props) {
    super(props);

    const cookies = new Cookies();
    let token = cookies.get('token');
    if (token != undefined) {
      var self = this;
      $.ajax({
        type: 'POST',
        url: Constants.HOST+'/api/checkToken',
        data: { token: token },
        success: function (jqXHR, textStatus, errorThrown) {
          if (jqXHR.response === "false") {
            window.location.href = './';
          } else self.setState({ loading: false });
        }
      });
    } else {
      window.location.href = './';
    }


  }

  render() {
    return (
      <section id="main">
        <Shapka />
        <Canvas/>
      </section>

    );
  }

}


export default MainPage;
