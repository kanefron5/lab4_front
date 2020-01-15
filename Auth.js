import React from 'react';
import Create from './Create'
import Signin from './Signin';
import './App.css';


class Auth extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            panel: "signin"
        };

        this.setPanel = this.setPanel.bind(this);

    }

    setPanel(panel) {
        this.setState({ panel });
    }


    render() {
        const { panel } = this.state;

        return (
            <table style={{width:'100%'}, {height:'100%'}}>
                <div class="container">
                    <PanelSelect selected={panel} clickHandler={this.setPanel} />
                    {panel === "signin" ? <Signin /> : null}
                    {panel === "create" ? <Create /> : null}
                </div>
            </table>

        )


    }

}

const PanelSelect = ({ selected, clickHandler }) => (

    <section class="panelSelect">
        <div
            class={selected === "signin" && "selected"}
            onClick={() => clickHandler("signin")}
        >
            Авторизация
      </div>
        <div
            class={selected === "create" && "selected"}
            onClick={() => clickHandler("create")}
        >
            Создать аккаунт
      </div>
    </section>
);


export default Auth;