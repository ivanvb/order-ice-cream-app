import React, {useContext} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap'
import { UserContext } from './UserContext';

const AppNavbar = () => {
    const [user, setUser] = useContext(UserContext);
    
    return (
        <Navbar
        collapseOnSelect expand="lg" bg="light" variant="light">
            <LinkContainer exact={true} to="/" activeClassName="active">
                <Nav.Item as={Navbar.Brand}>
                    Helados
                </Nav.Item>
            </LinkContainer>
            
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse>
                <LinkContainer to="/about" activeClassName="active">
                    <Nav.Item as={Nav.Link}>About</Nav.Item>
                </LinkContainer>
                {!user.isAuthenticated &&
                <LinkContainer to="/signup" activeClassName="active">
                    <Nav.Item as={Nav.Link}>Sign Up</Nav.Item>
                </LinkContainer>}
                {user.isAuthenticated && <Nav.Item as={Nav.Link}>{user.name}</Nav.Item>}
                {user.isAuthenticated && <Nav.Item as={Nav.Link} onClick={()=>{
                    setUser(()=> {
                        return {isAuthenticated: false}
                    });
                }}>Log Out</Nav.Item>}
            </Navbar.Collapse> 
        </Navbar>
    );
};

export default AppNavbar;