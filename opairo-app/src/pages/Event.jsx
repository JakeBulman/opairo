import React from 'react';
import {useParams} from 'react-router-dom';
import EventDetails from '../components/event/EventDetail';
import Layout from '../components/Layout';
import useSWR from 'swr';
import {fetcher} from '../helpers/axios';
import { Row, Col, Spinner } from 'react-bootstrap';

function Event() {
    const { name_slug } = useParams();
    const event = useSWR(`/event/${name_slug}/`, fetcher);

    return (
        <Layout hasNavigationBack>
            <div className="col-md-6 d-flex justify-content-center">
                <div className="content text-center p-2">
                    <h1 className="text-white pb-2">
                        Event Details.
                    </h1>
                </div>
            </div>
            <Row className="justify-content-evenly">
                {event.data && event.data.status === 404 ? 
                    <Col sm={9} className="text-center">
                        <p>This event no longer exists</p>
                    </Col>
                :
                <>
                {event.data ? (
                    <Col sm={9} className="text-center">
                        <EventDetails event={event.data} />
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
    )
}

export default Event;