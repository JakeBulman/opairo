import React from "react";
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getUser } from "../hooks/user.actions";
import useSWR from 'swr';
import { fetcher } from '../helpers/axios';
import ProfileCard from '../components/profile/ProfileCard';
import EventCard from '../components/event/EventCard';
import { Row, Card, Button, Placeholder, Spinner } from 'react-bootstrap';

function Welcome() {

    const account = getUser();
    const profile = useSWR(account ? `/account/${account.public_id}/` : null, fetcher).data;
    const referrer_profile = useSWR(account ? `/account/${account.referrer}/` : null, fetcher).data;
    const events = useSWR('/event/?limit=9', fetcher);

    return (
        <Layout>
            <Row className="px-4 pb-4">
                <Card className="pb-3">
                    { profile ? 
                    <>
                        <Card.Header className="text-nearwhite fw-bold pt-4">Your Profile</Card.Header>
                        <p className="px-3 pt-2" style={{fontSize:12}}>This is your profile card, it's how everyone else at Opairo will see you. You might want to take some time now to personalise your profile.</p>
                        <ProfileCard account={profile} />
                    </>
                    : null}
                    { referrer_profile ? 
                    <>    
                        <Card.Header className="text-nearwhite fw-bold pt-4">Your Referrer</Card.Header>              
                        <p className="px-3 pt-2" style={{fontSize:12}}>This is the profile card of the person who referred you, you can check out there profile and give them a follow if you want to keep up to date on them.</p>
                        <ProfileCard account={referrer_profile} />
                    </>  
                    : null }
                    { account.user_type === '2' ?
                    <>    
                        <Card.Header className="text-nearwhite fw-bold pt-4">New Event</Card.Header>              
                        <p className="px-3 pt-2" style={{fontSize:12}}>As an organiser, you can create new events.</p>
                        <Button as={Link} to={`/events/create`} className="pt-1" variant="success" type="submit">
                            New Event
                        </Button>
                    </>  
                    : null }
                    <>    
                        <Card.Header className="text-nearwhite fw-bold pt-4">Latest Events</Card.Header>              
                        <p className="px-3 pt-2" style={{fontSize:12}}>Check out some of the latest events happening on Opairo.</p>
                                            {events.data ? (
                        events.data && events.data.results.map((events, index) => (
                            <div className='d-flex flex-column h-100'>
                                <EventCard key={index} events={events} />
                            </div>
                            ))
                        ) : (
                            [...Array(9).keys()].map(key =>               
                            <div className='d-flex flex-column'>
                                <Card className="text-center" >
                                    <Card.Header>
                                        <Placeholder as={Card.Title} animation="wave">
                                            <Placeholder xs={6} bg="secondary" />
                                        </Placeholder>
                                    </Card.Header>
                                    <Card.Body >
                                        <Spinner animation="border" variant="secondary" role="status" className="mb-3" style={{ width: '46px', height: '46px' }} />
                                        <Placeholder as={Card.Text} animation="wave">
                                            <Placeholder xs={4} bg="secondary" /> <Placeholder xs={6} bg="secondary" />{' '}
                                        </Placeholder>
                                        <Placeholder.Button xs={4} variant="primary" />
                                    </Card.Body>
                                </Card>
                            </div>
                            )
                        )}
                    </> 

                </Card> 
            </Row>
            
        </Layout>
    );
}

export default Welcome;