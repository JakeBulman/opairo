import React from 'react';
import { Button } from 'react-bootstrap';
import {useParams, Link} from 'react-router-dom';
import EventCastingCard from '../components/event/EventCastingCard';
import Layout from '../components/Layout';
import useSWR from 'swr';
import {fetcher} from '../helpers/axios';
import { getUser } from '../hooks/user.actions';
import { Row, Col, Spinner } from 'react-bootstrap';

function EventCasting() {
    const { name_slug } = useParams();
    const event = useSWR(`/event/${name_slug}/`, fetcher);
    const user = getUser();
    console.log(event);

    return (
        <Layout hasNavigationBack>
            <Row className="justify-content-evenly">
                {event.data && event.data.status === 404 ? 
                    <Col sm={9} className="text-center">
                        <p>This event no longer exists</p>
                    </Col>
                :
                <>
                    { user && user.user_type === '2' ?
                    <div className="d-grid pb-3">
                        <Button as={Link} to={`/events/create`} className="mt-3" variant="success" type="submit">
                            New Event
                        </Button>
                    </div> 
                    : null }
                    { event.data ? (
                    event.data && event.data.cast.map((event, index) => (
                    <Col key={index} className='px-4 py-2' xs={12} md={6} lg={4}>
                        <div className='d-flex flex-column h-100'>
                            <EventCastingCard key={index} event={event} />
                        </div>
                    </Col>
                    ))
                    ) : (
                    <Col sm={9} className="text-center">
                        <Spinner animation="border" />
                    </Col>
                )}
                </>
            }
            </Row>
        </Layout>
    )
}

export default EventCasting;