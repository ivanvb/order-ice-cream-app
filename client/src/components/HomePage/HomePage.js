import React, {Fragment} from 'react';
import LoginForm from './LoginForm/LoginForm';


function HomePage(){
    return(
        <Fragment>
            <h2>Hello from Homepage</h2>
            <LoginForm/>
        </Fragment>
    );
}

export default HomePage;