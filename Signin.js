import React, { useState, useEffect } from "react";
import Button from 'react-toolbox/lib/button/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';
import Constants from './Constants'
import Cookies from 'universal-cookie';

class Signin extends React.Component {



    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            loading: true
        };


        const cookies = new Cookies();
        let token = cookies.get('token');
        if (token != undefined) {
            var self = this;
            $.ajax({
                type: 'POST',
                url: 'http://' + Constants.HOST + '/api/checkToken',
                data: { token: token },
                success: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.response !== "false") {
                        window.location.href = './main';
                    } else self.setState({ loading: false });
                }
            });


        } else {
            this.setState({ loading: false });
        }
        this.createClickHandler = this.createClickHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }


    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }
    createClickHandler(event) {
        const { email, password } = this.state;
        event.preventDefault();

        if (email === "" || password === "")
            toast.error("Не введен логин или пароль!!", {
                position: toast.POSITION.TOP_CENTER,
                closeButton: false,
                hideProgressBar: true
            });
        else {
            $.ajax({
                type: 'POST',
                url: 'http://' + Constants.HOST + '/api/login',
                data: { emailuser: email, passworduser: password },
                success: function (jqXHR, textStatus, errorThrown) {
                    const cookies = new Cookies();
                    cookies.set('token', jqXHR.response, { path: '/' });

                    toast.success("Авторизация успешна!", {
                        position: toast.POSITION.TOP_CENTER,
                        closeButton: false,
                        hideProgressBar: true
                    });
                    setTimeout(function () {
                        window.location.href = './main';
                    }, 1500);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    toast.error(JSON.parse(jqXHR.responseText).error, {
                        position: toast.POSITION.TOP_CENTER,
                        closeButton: false,
                        hideProgressBar: true
                    });
                }
            });
        }


    }

    render() {
        const { email, password, loading } = this.state;
        return (
            <div class="form">
                <ToastContainer />

                <form>
                    <label for="email">Логин</label>
                    <input
                        type="text"
                        name="email"
                        id="email"
                        onChange={this.handleChange}
                        required
                    />
                    <label for="password">Пароль</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        onChange={this.handleChange}
                        required
                    />
                    <Button label="Войти" onClick={this.createClickHandler} />


                </form>
            </div>
        );
    }

}

export default Signin;
