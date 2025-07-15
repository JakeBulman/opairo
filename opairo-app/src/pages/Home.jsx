import React from "react";
import Layout from '../components/Layout';
import { Row, Col } from 'react-bootstrap';
import userSWR from 'swr'
import ProfileCard from '../components/profile/ProfileCard';
import { fetcher } from '../helpers/axios';


function Home() {
    const profiles = userSWR('/account/?limit=5', fetcher);
    return (
        <Layout>
            <Row className='justify-content-evenly'>
                <Col className='border p-4' xs={12} md={6} lg={4}>
                    <h4 className='text-center'>Sample Profiles</h4>
                    <div className='d-flex flex-column p-1 gap-5'>
                        {profiles.data && profiles.data.results.map((profile, index) => (
                            <ProfileCard key={index} user={profile} />
                        ))}
                    </div>
                </Col>
            </Row>
        </Layout>
    );
}

export default Home