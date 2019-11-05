import React, {useState} from 'react';

export const UserContext = React.createContext();

export const UserProvider = (props) => {
    const [user, setUser] = useState({
        isAuthenticated: false
    })

    return(
        <UserContext.Provider value={[user, setUser]}>
            {props.children}
        </UserContext.Provider>
    );
}