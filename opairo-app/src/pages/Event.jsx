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