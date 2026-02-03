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

    return (
        <Layout hasNavigationBack>
            <div className="col-md-6 d-flex justify-content-center">
                <div className="content text-center p-2">
                    <h1 className="text-white pb-2">
                        Event Casting.
                    </h1>
                </div>
            </div>
            <Row className="justify-content-evenly">
                {event?.data && event?.data?.status === 404 ? 
                    <Col sm={9} className="text-center">
                        <p>This event no longer exists</p>
                    </Col>
                :
                <>
                { user?.public_id === event?.data?.organiser?.public_id ?
                    <div className="d-grid pb-3">
                        <Button as={Link} to={`/event/${name_slug}/casting/create`} className="mt-3" variant="base" type="submit">
                            New Casting
                        </Button>
                        <Button as={Link} to={`/event/${name_slug}/`} className="mt-3" variant="outline-base text-nearwhite" type="submit">
                            Back to Event
                        </Button>
                    </div> 
                : null }
                
                {event?.isLoading ? <Spinner animation="border" /> : null}
                { event?.data && event?.data?.cast.length !== 0 ? (
                    event?.data && event?.data?.cast.map((casting, index) => (
                    <Col key={index} className='px-4 py-2' xs={12} md={6} lg={4}>
                        <div className='d-flex flex-column h-100'>
                            <EventCastingCard key={index} casting={casting} event={event.data} />
                        </div>
                    </Col>
                    ))
                    ) : (
                    <Col sm={9} className="text-center">
                        You have no castings for this event yet.
                    </Col>
                )}
                </>
            }
            </Row>
        </Layout>
    )
}

export default EventCasting;