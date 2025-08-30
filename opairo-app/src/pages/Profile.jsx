import React from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import Layout from '../components/Layout';
import ProfileDetails from '../components/profile/ProfileDetails';
import fetcher from '../helpers/axios';
import { Row, Col, Spinner } from 'react-bootstrap';

function Profile() {
    const { account_slug } = useParams();
    const account = useSWR(`/account/${account_slug}/`, fetcher);

    return (
        <Layout hasNavigationBack>
            <Row className="justify-content-evenly">
                {account.error ? 
                    <Col sm={9} className="text-center">
                        <p>This account no longer exists</p>
                    </Col>
                :
                <>
                {account.data ? (
                        <ProfileDetails account={account.data} />
                    ) : (
                        <Spinner animation="border" />
                    )}
                </>
            }
            </Row>
        </Layout>
    );
}

export default Profile;