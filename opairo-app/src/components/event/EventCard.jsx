// import React, { useState, useEffect } from 'react';
import { Card, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// import fallbackPicture from '../../assets/white-bg.png';

function EventCard(props) {
    const navigate = useNavigate();
    const { events } = props;
    console.log(events);

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
        navigate(`/event/${events.public_id}`);
    };

    return (
        <Card className="text-center h-100">
            <Card.Header><Card.Title>{events.name}</Card.Title></Card.Header>
            <Card.Body>
                {/* <Image
                    src={event.picture}
                    roundedCircle
                    className="mb-3"
                    style={{ width: '50px', height: '50px' }}
                    onError={reloadSrc}
                /> */}
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