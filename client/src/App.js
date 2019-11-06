import React, {useContext} from 'react';
import AppNavbar from './components/AppNavbar';
import {Switch, BrowserRouter as Router, Route} from 'react-router-dom';
import About from './components/About';
import Login from './components/Login';
import {UserContext} from './components/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import SignUp from './components/SignUp';
import Home from './components/Home';
import ExpandedOrdersPackCard from './components/ExpandedOrdersPackCard';

function App(){
    var date = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));

    // request a weekday along with a long date
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    console.log(date.toLocaleDateString(undefined, options));
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
                    <ProtectedRoute
                        path="/expanded"
                        component={ExpandedOrdersPackCard}/>
                    <Route path="*">
                        404 not found
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
