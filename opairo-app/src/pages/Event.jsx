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
            <Row className='justify-content-center'>
                <Col className="text-center" xs={12} md={8} lg={6}>
                    {event.data ? (
                        <EventDetails event={event.data} />
                    ) : (
                        <Spinner animation="border" />
                    )}
                </Col>
            </Row>
        </Layout>
    )
}

export default Profile;