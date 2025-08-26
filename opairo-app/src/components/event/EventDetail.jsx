import React from 'react';
import { Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUser } from "../../hooks/user.actions";

function EventDetails(props) {

    const navigate = useNavigate();
    const { event } = props;

    return (
        <div>
            <div className='d-flex flex-row border-bottom p-5'>
                <Image
                    src={event.profile_picture}
                    roundedCircle
                    width={120}
                    height={120}
                    className="me-5 border border-primary border-2"
                />
                <div className='d-flex flex-column justify-content-center align-self-center mt-2'>
                    <p>{event.name}</p>
                    <p>{event.name_slug}</p>
                    <p>{event.date}</p>
                    <p>{event.time}</p>
                    {event.organiser.public_id === getUser().public_id && (
                    <Button variant="primary" onClick={() => navigate(`/event/${event.public_id}/edit/`)}>
                        Edit
                    </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EventDetails;