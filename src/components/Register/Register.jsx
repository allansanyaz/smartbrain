import React from "react";

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nameRegistered: '',
            emailRegistered: '',
            passwordRegistered: ''
        }
    }

    onNameChange = (event) => {
        this.setState({nameRegistered: event.target.value});
    }

    onEmailChange = (event) => {
        this.setState({emailRegistered: event.target.value});
    }

    onPasswordChange = (event) => {
        this.setState({passwordRegistered: event.target.value});
    }

    onSubmitRegister = () => {
        // fetch takes a second parameter of what to do with the response
        fetch('/register', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                name: this.state.nameRegistered,
                email: this.state.emailRegistered,
                password: this.state.passwordRegistered
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.id) {
                this.props.saveAuthTokenInSession(data.token);
                this.props.getProfile(data);
                this.props.onRouteChange('home');
            }
        });
    }

    render() {
        return (
            <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-3 center">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0 center">Register</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                                <input 
                                    onChange={this.onNameChange}
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="text" 
                                    name="name"  
                                    id="name" 
                                />
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input 
                                    onChange={this.onEmailChange}
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="email" 
                                    name="email-address"  
                                    id="email-address" 
                                />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input 
                                    onChange={this.onPasswordChange}
                                    className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="password" 
                                    name="password"  
                                    id="password" 
                                />
                            </div>
                        </fieldset>
                        <div className="">
                            <input 
                                onClick={this.onSubmitRegister}
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                                type="submit" 
                                value="Register" 
                            />
                        </div>
                    </div>
                </main>
            </article>
        );
    }
}

export default Register;