import React, { useState, useEffect } from 'react';
import { Card, Ratio, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import fallbackPicture from '../../assets/white-bg.png';
import ProfileDisciplineIcon from './ProfileDisciplineIcon';
import './ProfileCard.css';
import FadeInImage from '../FadeInImage'

function ProfileCard(props) {
    const { account } = props;

    console.log(account)

    const [imgSrc, setImgSrc] = useState('');
    const [fallback, setFallback] = useState(false);
    useEffect( () => {
    if(imgSrc){
        setImgSrc(imgSrc);
    }
    },[imgSrc])

    const reloadSrc = e => { 
    if(fallback){
        e.target.src = fallbackPicture;
    }else{
        e.target.src = imgSrc
        setFallback(true)
    }}
    
    return (
    <Card className='rounded-0 border-0 px-1 py-2 position-relative overflow-hidden bg-basevdark'>
    {/* Whole-card link */}
    <Link
    to={`/account/${account.account_slug}`}
    className="stretched-link"
    aria-label={`View ${account.account_name} profile`}
    
    />

    {/* Overlay */}
    <div className="card-overlay h-75">
        <div className="overlay-panel ps-5 p-3 border border-basedark border-4">
            <Row>
                <Col className='text-start text-nearwhite'>
                <Card.Title className="mb-2">
                    {account.account_name}
                </Card.Title>
                </Col>
            </Row>
            <Row>
                <ProfileDisciplineIcon disciplines={account.profile_disciplines} />
            </Row>
        </div>
    </div>

    {/* Circular image */}
    <div className="image-wrapper rounded-circle overflow-hidden">
        <Ratio aspectRatio="1x1">
        <FadeInImage
            src={account.profile_picture + "?nav=" + Date.now()}
            onError={reloadSrc}
            className="h-100 w-100"
            style={{ objectFit: "cover" }}
        />
        </Ratio>
    </div>


    </Card>
    );
}

export default ProfileCard;