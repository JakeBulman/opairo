import React from "react";
import Layout from '../components/Layout';
import { getUser } from "../hooks/user.actions";
import ProfileCard from '../components/profile/ProfileCard';
import { Container, Row } from 'react-bootstrap';

function Welcome() {

    const account = getUser();

    return (
        <Layout>
            <Container>
                <Row className="p-4">
                    <ProfileCard account={account} />
                    <p className="p-4">This is your profile card, it's how everyone else at Opairo will see you. You might want to take some time now to personalise your profile.</p>
                </Row>
            </Container>
        </Layout>
    );
}

export default Welcome;