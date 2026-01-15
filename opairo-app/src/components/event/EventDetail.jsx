import React, { act, useState } from 'react';
import { Button, Image, Row, Col, Ratio, Accordion } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUser } from "../../hooks/user.actions";
import { FaLocationDot, FaCalendarDays } from "react-icons/fa6"
import ReadMore from '../ReadMore';
import ProfileCard from '../profile/ProfileCard'


function EventDetails(props) {

    const navigate = useNavigate();
    const { event } = props;
    const event_date = new Date(event.date).toLocaleDateString("en-UK");
    const user = getUser();


    return (
    <>
        <Row>
            <Ratio aspectRatio="21x9">
                <Image
                    className='w-100'
                    src={event.event_picture}
                    width={100}
                />
            </Ratio>
        </Row>
        <Row className='pt-3 px-3'>
            <Col className='d-flex justify-content-end align-items-start'>
                <Button variant='secondary' className='py-0 ms-1' size='sm' onClick={() => navigate(`/event/${event.name_slug}`)}>
                    Share
                </Button>
                <Button variant='secondary' className='py-0 ms-1 ms-1' size='sm' onClick={() => navigate(`/event/${event.name_slug}`)}>
                    Follow
                </Button>
                {user && event.organiser.public_id === user.public_id && (
                <Button variant='secondary' className='py-0 ms-1' size='sm' onClick={() => navigate(`/event/${event.name_slug}/edit/`)}>
                    Edit
                </Button>
                )}
            </Col>
        </Row>
        <Row className='pt-3 px-3'>
            <Col  className='d-flex justify-content-start align-items-start'>
                <h1 className='text-start'>{event.name}</h1>
            </Col>
        </Row>
        <Row className='p-3 d-flex align-items-center'>
            <Col xs="auto" className='d-flex justify-content-start align-items-center'>
                <Image src={ event.organiser ? event.organiser.profile_picture + "?nav=nav" + Date.now().toString() : null }
                roundedCircle
                width={36}
                height={36}
                />
            </Col>
            <Col className='px-0 d-flex flex-column justify-content-center align-items-start'>
                <p className='mb-0'>By { event.organiser ? event.organiser.account_name : "Unknown Organizer" }</p>
            </Col>
            <Col xs="auto" className='d-flex justify-content-end align-items-center'>
            <Button variant='secondary' className='py-0' size='sm' onClick={() => navigate(`/account/${event.organiser ? event.organiser.account_slug : ""}/`)}>
                View Profile
            </Button>
            </Col>
        </Row>
        <Row className='px-3 d-flex align-items-center'>
            <Col className='p-0 d-flex justify-content-start align-items-center'>
                <FaLocationDot className='m-2' style={{color: '#474747'}} />{event.location}
            </Col>
        </Row>
        <Row className='px-3 pb-3 d-flex align-items-center'>
            <Col className='p-0 d-flex justify-content-start align-items-center'>
                <FaCalendarDays className='m-2' style={{color: '#474747'}} />{event_date} at {event.time}
            </Col>
        </Row>
        <hr style={{color: '#878787'}}/>
        <Row>
            <h3 className='p-2 text-start'>
                Description
            </h3>
        </Row>
        <Row className=''>
            <Col>
                <ReadMore
                text={event.description}
                maxHeight={100}
                />
            </Col>
        </Row>
        <hr style={{color: '#878787'}}/>
        <Row>
            <h3 className='p-2 text-start'>
                Organiser
            </h3>
        </Row>
        <Row>
            <Col>
                <ProfileCard account={event.organiser}/>
            </Col>
        </Row>
    </>
    );
}

export default EventDetails;