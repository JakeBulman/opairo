import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function EventCard(props) {
    const navigate = useNavigate();
    const { events } = props;

    const handleNavigateToEvent = () => {
        navigate(`/event/${events.name_slug}`);
    };

    return (
        <Card className="text-center h-100">
            <Card.Header><Card.Title>{events.name}</Card.Title></Card.Header>
            <Card.Body>
                <Card.Text>
                    {events.date || 'No slug available.'} - {events.organiser.account_name || 'No email available.'}
                </Card.Text>
                <Button variant="primary" onClick={handleNavigateToEvent}>
                    View Event
                </Button>
            </Card.Body>
        </Card>
    );
}

export default EventCard;