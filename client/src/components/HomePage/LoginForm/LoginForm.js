import React, {Component} from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

class LoginForm extends Component{

    loggedUser;

    async logUser(){
        const req = await fetch('/user/login', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: 'email',
                        password: 'abcd1234'
                    })})
        const response = await req.json();
        if(req.status === 200){
            this.loggedUser = React.createContext('')
        }
    }

    render(){
        return(
            <Grid textAlign="center" style={{height: '100vh'}} verticalAlign="middle">
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as='h2' textAlign='center'>
                        Log-in to your account
                    </Header>
                    <Form size='large'>
                        <Segment stacked>
                            <Form.Input fluid icon='user' iconPosition='left' placeholder='Email address'/>
                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                            />
                            <Button color='blue' fluid size='large' onClick={this.logUser}>
                                Login
                            </Button>
                        </Segment>
                    </Form>
                    <Message>
                        Don't have an account? <a href='#'>Sign Up</a>
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default LoginForm;