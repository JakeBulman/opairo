import React, { useState, useEffect } from 'react';
import { Navbar, Container, Image, NavDropdown, Nav, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { getUser } from "../hooks/user.actions";
import useSWR from 'swr';
import { fetcher } from '../helpers/axios';
import logo_icon from '../assets/Icon36.png';
import fallbackPicture from '../assets/white-bg.png';
import FadeInImage from './FadeInImage'


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
                    <Button as={Link} to={`/login/`} variant="outline-base bg-none text-nearwhite" className="me-2 fw-bold" size="sm">Sign In</Button>
                </Nav.Item>
                <Nav.Item className="d-flex align-items-center me-3">
                    <Button as={Link} to={`/register/`} variant="base" className='fw-bold' size="sm">Sign Up</Button>
                </Nav.Item>
                <Nav.Item className="d-flex align-items-center p-0">
                    <NavDropdown
                        drop="start"
                        menuVariant="dark"
                        className="text-white"
                        title={
                        <span className="d-flex align-items-center">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            >
                            <path d="M1 3h14v2H1zM1 7h14v2H1zM1 11h14v2H1z" />
                            </svg>
                        </span>
                        }
                    >
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
                <NavDropdown menuVariant="dark" drop="start" title={
                    <FadeInImage src={ profile.data ? profile.data.profile_picture + "?nav=nav" + Date.now().toString() : null }
                    roundedCircle
                    className="border border-danger border-1"
                    style={{ width: '40px', height: '40px' }}
                    onError={reloadSrc}
                    crossOrigin="anonymous"
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
        <Navbar bg='basedark' variant='dark' sticky="top">
            <Container style={{ height: '36px' }}>
                <Navbar.Brand className='fw-bold text-white' as={Link} to={`/`}>
                    <Image
                        src={logo_icon}
                        className="me-2"
                        style={{ width: '36px', height: '36px' }}
                    />
                </Navbar.Brand>
                <Nav className='justify-content-end'>
                    <NavMenu account={account}/>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default Navigationbar;