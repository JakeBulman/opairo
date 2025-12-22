import React from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import Layout from '../components/Layout';
import UpdateProfileForm from '../components/profile/UpdateProfileForm';
import fetcher from '../helpers/axios';
import { Row, Col, Spinner } from 'react-bootstrap';

function EditProfile() {
    const { public_id } = useParams();
    const account = useSWR(`/account/${public_id}`, fetcher);

    return (
        <Layout hasNavigationBack>
            <Row className="justify-content-evenly">
                {account.data && account.data.status === 404 ? 
                    <Col sm={9} className="text-center">
                        <p>This profile no longer exists</p>
                    </Col>
                :
                <>
                {account.data ? (
                    <Col sm={9} className="text-center">
                        <UpdateProfileForm public_id={account.data.data.public_id} />
                    </Col>
                ) : (
                    <Col sm={9} className="text-center">
                        <Spinner animation="border" />
                    </Col>
                )}
                </>
            }
            </Row>
        </Layout>
    );
}

export default EditProfile;