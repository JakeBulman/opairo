import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import Layout from '../components/Layout';
import UpdateProfileForm from '../components/profile/UpdateProfileForm';
import fetcher from '../helpers/axios';
import { Row, Col, Spinner } from 'react-bootstrap';

function EditProfile() {
    const { public_id } = useParams();
    const account_api = useSWR(`/account/${public_id}`, fetcher);
    const [account, setAccount] = useState(null);

    useEffect(() => {
        setAccount(account_api ? account_api.data : null);
    }, [account_api]);

    return (
        <Layout hasNavigationBack>
            <div className="col-md-6 d-flex justify-content-center">
                <div className="content text-center p-2">
                    <h1 className="text-white pb-2">
                        Edit Profile.
                    </h1>
                </div>
            </div>
            {account ? 
            <Row className="justify-content-evenly">
                {account.data && account.data.status === 404 ? 
                    <Col sm={9} className="text-center">
                        <p>This profile no longer exists</p>
                    </Col>
                :
                <>
                {account.data ? (
                    <Col sm={9} className="text-center">
                        <UpdateProfileForm account={account.data} public_id={public_id} />
                    </Col>
                ) : (
                    <Col sm={9} className="text-center">
                        <Spinner animation="border" />
                    </Col>
                )}
                </>
            }
            </Row>
            : null
            }
        </Layout>
    );
}

export default EditProfile;