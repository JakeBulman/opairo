import React from 'react';
import { Navbar, Container, Image, NavDropdown, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUser } from "../hooks/user.actions";

function Navigationbar() {
    const navigate = useNavigate();
    const user = getUser();
    const handleLogout = () => {
        localStorage.removeItem("auth");
        navigate("/login/")
    }
    return (
        <Navbar bg='primary' variant='dark'>
            <Container>
                <Navbar.Brand className='fw-bold' href='#home'>
                    Opairo
                </Navbar.Brand>
                <Navbar.Collapse className='justify-content-end'>
                    <Nav>
                        <NavDropdown title={
                            <Image src={ user.profile_picture }
                            roundedCircle
                            className=""
                            style={{ width: '36px', height: '36px' }}
                            />
                        }>
                            <NavDropdown.Item href='#'>Profile</NavDropdown.Item>
                            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigationbar;