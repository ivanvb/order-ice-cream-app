import React from 'react';
import {UserContext} from './UserContext';
import Alert from 'react-bootstrap/Alert';

class SignUp extends React.Component{

    initialState = {name: '', email: '', password: '', showAlert: false};

    constructor(props){
        super(props);
        this.state = {...this.initialState};

        this.handleChanges =  this.handleChanges.bind(this);
        this.handleSubmit =  this.handleSubmit.bind(this);
    }

    handleChanges(e){
        this.setState({[e.target.name]: e.target.value});
    }

    async handleSubmit(e){
        e.preventDefault();
        const res = await fetch('/user/signup',{
            method: 'POST',
            body: JSON.stringify(this.state),
            headers:{
                'Content-Type': 'application/json'
            }
        });
        const json = await res.json();

        const [, setUser] = this.context;
        if(res.status === 200){
            setUser(()=>{
                return {...json.user, isAuthenticated: true};
            })
        } else {
            this.setState({...this.initialState, showAlert: true});
        }
    }

    render(){
        return(
            <>
                <Alert
                variant='danger'
                dismissable
                show={this.state.showAlert}
                onClose={()=>{this.setState({showAlert: false})}}>
                    This email is already in use.
                </Alert>
                <form onSubmit={this.handleSubmit}>
                    <input name="name" onChange={this.handleChanges} value={this.state.name}/>
                    <input name="email" onChange={this.handleChanges} value={this.state.email}/>
                    <input name="password" onChange={this.handleChanges} value={this.state.password}/>
                    <button type="submit">Submit</button>
                </form>
            </>
        )
    }
}

SignUp.contextType = UserContext;
export default SignUp;