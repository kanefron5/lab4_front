import React from 'react';
import Button from 'react-toolbox/lib/button/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';
import Constants from './Constants'

class Create extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            confirmPassword: ""
        };
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.confirmPasswordChangeHandler = this.confirmPasswordChangeHandler.bind(this);
        this.createClickHandler = this.createClickHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    passwordChangeHandler(event) {
        const element = event.target;
        const password = element.value;
        element.classList.remove("low", "medium", "high");

        if (password.length >= 6) {
            element.classList.add("high");
        } else if (password.length >= 3) {
            element.classList.add("medium");
        } else if (password.length > 0) {
            element.classList.add("low");
        }

        const confirmPasswordElement = document.getElementById('confirmPassword');
        if (password === confirmPasswordElement.value) {
            confirmPasswordElement.classList.remove("high");
            confirmPasswordElement.classList.add("high");
        } else {
            confirmPasswordElement.classList.remove("high");
            confirmPasswordElement.classList.add("low");
        }

        this.handleChange(event);
    }
    confirmPasswordChangeHandler(event) {
        const element = event.target;
        const confirmPassword = element.value;
        const password = document.getElementById("password").value;
        element.classList.remove("low", "high");

        if (confirmPassword !== password && password.length !== 0) {
            element.classList.add("low");
        } else if (password.length !== 0) {
            element.classList.add("high");
        }

        this.handleChange(event);
    }
    createClickHandler(event) {
        const { email, password, confirmPassword } = this.state;
        event.preventDefault();
        if (password === confirmPassword) {
            $.ajax({
                type: 'POST',
                url: Constants.HOST+'/api/registration',
                data: { emailuser: email, passworduser: password },
                success: function (jqXHR, textStatus, errorThrown) {
                    toast.success(jqXHR.response, {
                        position: toast.POSITION.TOP_CENTER,
                        closeButton: false,
                        hideProgressBar: true
                    });
                    setTimeout(function () {
                        window.location.reload();
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
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }
    render() {
        const { email, password, confirmPassword } = this.state;
        return (
            <div class="form">
                <ToastContainer />

                <form>
                    <label for="email">Логин</label>
                    <input
                        type="text"
                        name="email"
                        id="email"
                        value={email}
                        onChange={this.handleChange}
                        required
                    />
                    <label for="password">Пароль</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={this.passwordChangeHandler}
                        required
                    />
                    <label for="confirmPassword">Подтвердите пароль</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={this.confirmPasswordChangeHandler}
                        required
                    />
                    <Button label="Зарегистрироваться" onClick={this.createClickHandler}></Button>
                </form>
            </div>
        );
    }
}
export default Create;
