import React from "react";
import Layout from '../components/Layout';
import { Row, Col, Card, Placeholder, Spinner } from 'react-bootstrap';
import useSWR from 'swr'
import ProfileCard from '../components/profile/ProfileCard';
import { fetcher } from '../helpers/axios';


function Home() {
    const account = useSWR('/account/?limit=9', fetcher);
    return (
        <Layout>
            <Row className='justify-content-evenly'>
                <h4 className='text-center'>Profiles</h4>
                    {account.data ? (
                    account.data && account.data.results.map((account, index) => (
                    <Col className='p-4' xs={12} md={6} lg={4}>
                        <div className='d-flex flex-column py-1 h-100'>
                            <ProfileCard key={index} account={account} />
                        </div>
                    </Col>
                    ))
                    ) : (
                    [...Array(9).keys()].map(key =>  
                    <Col className='p-4' xs={12} md={6} lg={4} key={key}>                
                        <div className='d-flex flex-column py-1'>
                            <Card className="text-center" >
                                <Card.Header>
                                    <Placeholder as={Card.Title} animation="wave">
                                        <Placeholder xs={6} bg="secondary" />
                                    </Placeholder>
                                </Card.Header>
                                <Card.Body >
                                    <Spinner animation="border" variant="secondary" role="status" className="mb-3" style={{ width: '46px', height: '46px' }} />
                                    <Placeholder as={Card.Text} animation="wave">
                                        <Placeholder xs={4} bg="secondary" /> <Placeholder xs={6} bg="secondary" />{' '}
                                    </Placeholder>
                                    <Placeholder.Button xs={4} variant="primary" />
                                </Card.Body>
                            </Card>
                        </div>
                    </Col> 
                    )
                    )}
                
            </Row>
        </Layout>
    );
}

export default Home