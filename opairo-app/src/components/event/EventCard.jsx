import React, { useState, useEffect } from 'react';
import { Card, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import fallbackPicture from '../../assets/white-bg.png';

function EventCard(props) {
    const navigate = useNavigate();
    const { event } = props;

    // const [imgSrc, setImgSrc] = useState('');
    // const [fallback, setFallback] = useState(false);
    // useEffect( () => {
    // if(imgSrc){
    //     setImgSrc(imgSrc);
    // }
    // },[imgSrc])

    // const reloadSrc = e => { 
    // if(fallback){
    //     e.target.src = fallbackPicture;
    // }else{
    //     e.target.src = imgSrc
    //     setFallback(true)
    // }}

    const handleNavigateToEvent = () => {
        navigate(`/account/${event.public_id}`);
    };

    return (
        <Card className="text-center h-100">
            <Card.Header><Card.Title>{event.name}</Card.Title></Card.Header>
            <Card.Body>
                {/* <Image
                    src={event.picture}
                    roundedCircle
                    className="mb-3"
                    style={{ width: '50px', height: '50px' }}
                    onError={reloadSrc}
                /> */}
                <Card.Text>
                    {event.date || 'No slug available.'} - {event.organiser || 'No email available.'}
                </Card.Text>
                <Button variant="primary" onClick={handleNavigateToEvent}>
                    View Profile
                </Button>
            </Card.Body>
        </Card>
    );
}

export default EventCard;