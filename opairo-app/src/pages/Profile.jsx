import React from 'react';
import {useParams} from 'react-router-dom';
import ProfileDetails from '../components/profile/ProfileDetail';
import Layout from '../components/Layout';
import useSWR from 'swr';
import {fetcher} from '../helpers/axios';
import { Row, Col } from 'react-bootstrap';

function Profile() {
    const { account_slug } = useParams();
    const account = useSWR(`/account/${account_slug}/`, fetcher);

    return (
        <Layout hasNavigationBack>
            <Row className='justify-content-center'>
                <Col xs={12} md={8} lg={6}>
                    {account.data ? (
                        <ProfileDetails account={account.data} />
                    ) : (
                        <div>Loading...</div>
                    )}
                </Col>
            </Row>
        </Layout>
    )
}

export default Profile;