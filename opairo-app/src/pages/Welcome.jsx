import React from "react";
import Layout from '../components/Layout';
import { getUser } from "../hooks/user.actions";
import useSWR from 'swr';
import { fetcher } from '../helpers/axios';
import ProfileCard from '../components/profile/ProfileCard';
import { Row, Card } from 'react-bootstrap';

function Welcome() {

    const account = getUser();
    const profile = useSWR(account ? `/account/${account.public_id}/` : null, fetcher).data;

    return (
        <Layout>
            <Row className="p-4">
                <Card className="P-0">
                <div className="mt-3">
                <ProfileCard account={profile} />
                </div>
                <p className="p-3" style={{fontSize:12}}>This is your profile card, it's how everyone else at Opairo will see you. You might want to take some time now to personalise your profile.</p>
                </Card>
            </Row>
        </Layout>
    );
}

export default Welcome;