import React, {useContext} from 'react';
import AppNavbar from './components/AppNavbar';
import {Switch, BrowserRouter as Router, Route} from 'react-router-dom';
import About from './components/About';
import Login from './components/Login';
import {UserContext} from './components/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import SignUp from './components/SignUp';
import Home from './components/Home';

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
                        pathToRedir="/home"
                        component={Login}/>
                    <ProtectedRoute
                        path="/signup"
                        condition={!user.isAuthenticated}
                        pathToRedir="/home"
                        component={SignUp}/>
                    <ProtectedRoute
                        path="/home"
                        component={Home}/>
                    <Route path="*">
                        404 not found
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
