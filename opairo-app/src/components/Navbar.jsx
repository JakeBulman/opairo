import React from 'react';
import { Navbar, Container, Image, NavDropdown, Nav } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { getUser } from "../hooks/user.actions";
import useSWR from 'swr';
import { fetcher } from '../helpers/axios';


function Navigationbar() {
    const navigate = useNavigate();
    const account = getUser();
    console.log("Account: ", account ? account : "No account data found");


    
    const handleLogout = () => {
        localStorage.removeItem("auth");
        navigate("/login/");
    }
    function NavMenu(account) {
        // Check if user is not logged in, if not return basic nav
        console.log("Account2: ", account.account);
        const profile = useSWR(account.account ? `/account/${account.account.public_id}/` : null, fetcher);
        console.log("Profile data: ", profile);
        if (!account.account) {
            console.log("No account data found, returning basic nav");
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
            console.log("Account data found, returning user nav");
            return(
            <Nav>
                <NavDropdown title={
                    <Image src={ profile.data ? profile.data.profile_picture : "/static/images/default-avatar.png" }
                    roundedCircle
                    className=""
                    style={{ width: '36px', height: '36px' }}
                    />
                }>
                    <NavDropdown.Item as={Link} to={`/account/${account.account.account_slug}`}>Profile</NavDropdown.Item>
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
                    <NavMenu account={account} />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigationbar;