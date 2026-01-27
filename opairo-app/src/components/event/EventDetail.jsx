import React from 'react';
import { Button, Image, Row, Col, Ratio, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUser } from "../../hooks/user.actions";
import { FaLocationDot, FaCalendarDays } from "react-icons/fa6"
import ReadMore from '../ReadMore';
import ProfileCard from '../profile/ProfileCard'
import EventCard from '../../components/event/EventCard';
import EventCastingCard from './EventCastingCard';
import { fetcher } from '../../helpers/axios';
import useSWR from 'swr'


function EventDetails(props) {

    const navigate = useNavigate();
    const { event } = props;
    const event_date = new Date(event.date).toLocaleDateString("en-UK");
    const user = getUser();
    const events = useSWR('/event/?limit=9', fetcher);

    return (
    <>
        <Row>
            <Ratio aspectRatio="21x9">
                <div className='position-absolute w-100 h-100' style={{backgroundColor: 'rgba(0, 0, 0)', zIndex: 1}}>
                <Image
                    className='w-100 h-100 object-fit-contain'
                    src={event.event_picture}
                    fluid
                />
                </div>
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
            <Col  className='px-1 d-flex justify-content-start align-items-start'>
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
                <FaLocationDot className='m-2' style={{color: '#c7c7c7'}} />{event.location}
            </Col>
        </Row>
        <Row className='px-3 pb-3 d-flex align-items-center'>
            <Col className='p-0 d-flex justify-content-start align-items-center'>
                <FaCalendarDays className='m-2' style={{color: '#c7c7c7'}} />{event_date} at {event.time}
            </Col>
        </Row>
        <hr style={{color: '#878787'}}/>
        <Row>
            <h3 className='py-2 px-3 text-start'>
                Description
            </h3>
        </Row>
        <Row className=''>
            <Col>
                <ReadMore
                text={event.description}
                maxHeight={50}
                />
            </Col>
        </Row>
        <hr style={{color: '#878787'}}/>
        <Row>
            <h3 className='py-2 px-3 text-start'>
                Cast
            </h3>
        </Row>
        <Row className='pb-3 px-3 d-flex justify-content-centre align-items-center'>
            {user && event.organiser.public_id === user.public_id && (
                <Button variant='secondary' onClick={() => navigate(`/event/${event.name_slug}/casting/`)}>
                    Manage Cast
                </Button>
            )}
        </Row>
        <Row>
            {event.cast && event.cast.map((casting, index) => (
                <Col key={index} className='px-4 py-2' xs={12} md={6} lg={4}>
                    <div className='d-flex flex-column h-100'>
                        <EventCastingCard casting={casting} />
                    </div>
                </Col>
            ))}
        </Row>
        <hr style={{color: '#878787'}}/>
        <Row>
            <h3 className='py-2 px-3 text-start'>
                Organiser
            </h3>
        </Row>
        <Row>
            <Col>
                <ProfileCard account={event.organiser}/>
            </Col>
        </Row>
        <hr style={{color: '#878787'}}/>
        <Row>
            <h3 className='py-2 px-3 text-start'>
                Events you might like
            </h3>
        </Row>
        <Row>
            <Col>
                <Carousel slide={false} controls={true} indicators={true} className='pb-5'>
                    {events.data ? (
                    events.data && events.data.results.map((events, index) => (
                    <Carousel.Item key={index}>
                        <EventCard key={index} events={events} />
                    </Carousel.Item>
                    )))
                    :
                    <div></div>
                    }
                </Carousel>
            </Col>
        </Row>
    </>
    );
}

export default EventDetails;