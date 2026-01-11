import React, { useState, useEffect } from 'react';
import { Navbar, Container, Image, NavDropdown, Nav, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { getUser } from "../hooks/user.actions";
import useSWR from 'swr';
import { fetcher } from '../helpers/axios';
import fallbackPicture from '../assets/white-bg.png';


function Navigationbar() {
    const navigate = useNavigate();
    const account = getUser();
    const profile = useSWR(account ? `/account/${account.public_id}/` : null, fetcher);

    
    const handleLogout = () => {
        localStorage.removeItem("auth");
        navigate("/login/");
    }
    function NavMenu(account) {
        // Check if user is not logged in, if not return basic nav
        const [imgSrc, setImgSrc] = useState('');
        const [fallback, setFallback] = useState(false);
        useEffect( () => {
        if(imgSrc){
            setImgSrc(imgSrc);
        }
        },[imgSrc])

        const reloadSrc = e => { 
        if(fallback){
            e.target.src = fallbackPicture;
        }else{
            e.target.src = imgSrc
            setFallback(true)
        }}

        if (!account.account) {
            return(
            <Nav>
                <Nav.Item className="d-flex align-items-center">
                    <Button as={Link} to={`/login/`} variant="outline-light" className="border border-2 text-dark me-2" size="sm">Sign In</Button>
                </Nav.Item>
                <Nav.Item className="d-flex align-items-center">
                    <Button as={Link} to={`/register/`} variant="success" size="sm">Sign Up</Button>
                </Nav.Item>
                <Nav.Item className="d-flex align-items-center">
                    <NavDropdown drop="start" title={
                        <Image src={ "https://uxwing.com/wp-content/themes/uxwing/download/web-app-development/3-vertical-dots-icon.png" }
                        roundedCircle
                        className="p-0"
                        style={{ width: '20px', height: '20px' }}
                        crossorigin="anonymous"
                        />}>
                        <NavDropdown.Header>Links</NavDropdown.Header>
                            <NavDropdown.Item as={Link} to={`/profiles/`}>Profiles</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={`/events/`}>Events</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Header>Account</NavDropdown.Header>
                            <NavDropdown.Item as={Link} to={`/login/`}>My Profile</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={`/login/`}>Login</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={`/register/`}>Register</NavDropdown.Item>
                    </NavDropdown>
                </Nav.Item>
                
                

            </Nav>
            )
        }
        else {
            return(
            <Nav>
                <NavDropdown drop="start" title={
                    <Image src={ profile.data ? profile.data.profile_picture + "?nav=true" : null }
                    roundedCircle
                    className=""
                    style={{ width: '36px', height: '36px' }}
                    onError={reloadSrc}
                    crossorigin="anonymous"
                    />
                }>
                    <NavDropdown.Header>Links</NavDropdown.Header>
                        <NavDropdown.Item as={Link} to={`/profiles/`}>Profiles</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to={`/events/`}>Events</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Header>Account</NavDropdown.Header>
                        <NavDropdown.Item as={Link} to={`/account/${account.account.account_slug}`}>My Profile</NavDropdown.Item>
                        <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
            </Nav>
            )
        }
    }

    return (
        <Navbar bg='white' variant='dark' sticky="top">
            <Container style={{ height: '36px' }}>
                <Navbar.Brand className='fw-bold text-danger' as={Link} to={`/`}>
                    Opairo
                </Navbar.Brand>
                <Nav className='justify-content-end'>
                    <NavMenu account={account}/>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default Navigationbar;