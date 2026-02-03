import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function EventCard(props) {
    const { events } = props;
    const eventDate = new Date(events.date).toLocaleDateString('en-GB');

    return (
        <Card className="text-center h-100 bg-basedark text-nearwhite">
            <Link
            to={`/event/${events.name_slug}`}
            className="stretched-link"
            aria-label={`View ${events.name} event`}
            
            />
            <Card.Body>
                <Row>
                <Col>
                <Card.Img
                    src={events.event_picture}
                    // onError={}
                    className="mh-100"
                    style={{ objectFit: "contain" }}
                />
                </Col>
                <Col>
                <Card.Title>{events.name}</Card.Title>
                <Card.Text>
                    {eventDate || 'No date available.'}
                </Card.Text>
                <Card.Text>
                    {events.organiser.account_name || 'No organiser available.'}
                </Card.Text>
                </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default EventCard;