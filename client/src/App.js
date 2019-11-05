import React, {useContext} from 'react';
import AppNavbar from './components/AppNavbar';
import {Switch, BrowserRouter as Router, Route} from 'react-router-dom';
import About from './components/About';
import Login from './components/Login';
import {UserContext} from './components/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import SignUp from './components/SignUp';

function App(){
    const [user] = useContext(UserContext);

    return (
        <div className="content">
            <Router>
                <AppNavbar/>
                <Switch>
                    <ProtectedRoute path="/about" component={About}/>
                    <ProtectedRoute
                        exact 
                        path="/" 
                        condition={!user.isAuthenticated}
                        pathToRedir="/about"
                         component={Login}/>
                    <ProtectedRoute
                        path="/signup"
                        condition={!user.isAuthenticated}
                        pathToRedir="/about"
                        component={SignUp}/>
                    <Route path="*">
                        404 not found
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
