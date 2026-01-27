import React from "react";
import Layout from '../components/Layout';
import { Row, Col, Card, Button, Placeholder, Spinner } from 'react-bootstrap';
import useSWR from 'swr'
import EventCard from '../components/event/EventCard';
import { fetcher } from '../helpers/axios';
import { getUser } from '../hooks/user.actions';
import { Link } from 'react-router-dom';


function Home() {
    const events = useSWR('/event/?limit=9', fetcher);
    const user = getUser();

    return (
        <Layout>
            <Row className='justify-content-evenly'>
                    <div className="col-md-6 d-flex justify-content-center">
                        <div className="content text-center p-2">
                            <h1 className="text-white pb-2">
                                Events.
                            </h1>
                        </div>
                    </div>
                    { user && user.user_type === '2' ?
                    <div className="d-grid pb-3">
                        <Button as={Link} to={`/events/create`} className="mt-3" variant="success" type="submit">
                            New Event
                        </Button>
                    </div> 
                    : null }
                    {events.data ? (
                    events.data && events.data.results.map((events, index) => (
                    <Col key={index} className='px-4 py-2' xs={12} md={6} lg={4}>
                        <div className='d-flex flex-column h-100'>
                            <EventCard key={index} events={events} />
                        </div>
                    </Col>
                    ))
                    ) : (
                    [...Array(9).keys()].map(key =>  
                    <Col className='px-4 py-2' xs={12} md={6} lg={4} key={key}>                
                        <div className='d-flex flex-column'>
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