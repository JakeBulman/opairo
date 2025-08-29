import React from 'react';
import {useParams} from 'react-router-dom';
import EventDetails from '../components/event/EventDetail';
import Layout from '../components/Layout';
import useSWR from 'swr';
import {fetcher} from '../helpers/axios';
import { Row, Col, Spinner } from 'react-bootstrap';

function Profile() {
    const { name_slug } = useParams();
    const event = useSWR(`/event/${name_slug}/`, fetcher);
    console.log(event.data);

    return (
        <Layout hasNavigationBack>
            <Row className="justify-content-evenly">
                {event.error ? 
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

export default Profile;