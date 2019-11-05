import React, {useContext} from 'react';
import {UserContext} from './UserContext';

function About(){
    const [user] = useContext(UserContext);

    return(
        <p>About, {JSON.stringify(user)}</p>
    )
}

export default About;