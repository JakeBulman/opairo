import React from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import Layout from '../components/Layout';
import UpdateEventForm from '../components/event/UpdateEventForm';
import fetcher from '../helpers/axios';
import { Row, Col, Spinner } from 'react-bootstrap';

function EditEvent() {
    const { public_id } = useParams();
    const event = useSWR(`/event/${public_id}`, fetcher);

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
                        <UpdateEventForm event={event.data.data} />
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
    );
}

export default EditEvent;