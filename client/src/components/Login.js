import React from 'react';
import Container from 'react-bootstrap/Container';
import {UserContext} from './UserContext';

class Login extends React.Component{

    initialState = {email: '', password: ''};

    constructor(props){
        super(props);
        this.state = {...this.initialState};

        this.tryLogIn = this.tryLogIn.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async handleChange(e){
        this.setState({[e.target.name]: e.target.value});
    }

    async tryLogIn(e){
        e.preventDefault();
        const data = {email: this.state.email, password: this.state.password}
        const res = await fetch('/user/login' , {
            method: 'POST', 
            body: JSON.stringify(data),
            headers:{
              'Content-Type': 'application/json'
            }
          });
        const json = await res.json();

        if(res.status === 401){
            this.setState({...this.initialState});            
        } else {
            const [, setUser] = this.context;
            setUser(() => {
                return {...json.user, isAuthenticated: true}
            });
        }
    }

    render(){
        return(
            <Container>
                <form onSubmit={this.tryLogIn}>
                    <input name="email" value={this.state.email} onChange={this.handleChange}/>
                    <input name="password" value={this.state.password} onChange={this.handleChange}/>
                    <button type="submit">Submit</button>
                </form>
            </Container>
        );
    }
}

Login.contextType = UserContext;

export default Login;