import React from "react";
import Layout from '../components/Layout';
import { Row, Col } from 'react-bootstrap';
import useSWR from 'swr'
import ProfileCard from '../components/profile/ProfileCard';
import { fetcher } from '../helpers/axios';


function Home() {
    const account = useSWR('/account/?limit=10', fetcher);
    return (
        <Layout>
            <Row className='justify-content-evenly'>
                    {account.data ? (
                    account.data && account.data.results.map((account, index) => (
                    <Col className='border p-4' xs={12} md={6} lg={4}>
                        <h4 className='text-center'>Sample Profiles</h4>
                        <div className='d-flex flex-column p-1 gap-5'>
                            <ProfileCard key={index} account={account} />
                        </div>
                    </Col>
                    ))
                    ) : (
                    <Col className='border p-4' xs={12} md={6} lg={4}>
                        <h4 className="text-center">Loading...</h4>
                    </Col>
                    )}
            </Row>
        </Layout>
    );
}

export default Home