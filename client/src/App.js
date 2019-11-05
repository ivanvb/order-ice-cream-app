import React, {useContext} from 'react';
import AppNavbar from './components/AppNavbar';
import {Switch, BrowserRouter as Router} from 'react-router-dom';
import About from './components/About';
import Login from './components/Login';
import {UserContext} from './components/UserContext';
import ProtectedRoute from './components/ProtectedRoute';

function App(){
    const [user] = useContext(UserContext);
    console.log(user.isAuthenticated)
    return (
        <div className="content">
            <Router>
                <AppNavbar/>
                <Switch>
                    <ProtectedRoute path="/about" component={About}/>
                    <ProtectedRoute 
                        path="/" 
                        condition={!user.isAuthenticated}
                        pathToRedir="/about"
                         component={Login}/>
                    {/* <Route exact path="/" component={Home}/> */}
                </Switch>
            </Router>
        </div>
        );
}

export default App;
