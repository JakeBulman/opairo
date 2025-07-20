import React from 'react';
import { Navbar, Container, Image, NavDropdown, Nav } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { getUser } from "../hooks/user.actions";

function Navigationbar() {
    const navigate = useNavigate();
    const user = getUser();
    const handleLogout = () => {
        localStorage.removeItem("auth");
        navigate("/login/");
    }
    function NavMenu(user) {
        // Check if user is not logged in, if not return basic nav
        if (!user.user) {
            return(
            <Nav>
                <NavDropdown title={"Account"}>
                    <NavDropdown.Item as={Link} to={`/login/`}>Profile</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to={`/login/`}>Login</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to={`/register/`}>Register</NavDropdown.Item>
                </NavDropdown>
            </Nav>
            )
        }
        else {
            return(
            <Nav>
                <NavDropdown title={
                    <Image src={ user.user.profile_picture }
                    roundedCircle
                    className=""
                    style={{ width: '36px', height: '36px' }}
                    />
                }>
                    <NavDropdown.Item as={Link} to={`/account/${user.user.account_slug}`}>Profile</NavDropdown.Item>
                    <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
            </Nav>
            )
        }
    }

    return (
        <Navbar bg='primary' variant='dark'>
            <Container>
                <Navbar.Brand className='fw-bold' as={Link} to={`/`}>
                    Opairo
                </Navbar.Brand>
                <Navbar.Collapse className='justify-content-end'>
                    <NavMenu user={user} />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigationbar;