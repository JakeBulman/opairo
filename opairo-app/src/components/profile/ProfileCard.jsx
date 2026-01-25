import React, { useState, useEffect } from 'react';
import { Card, Button, Image, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import fallbackPicture from '../../assets/white-bg.png';
import ProfileDisciplineIcon from './ProfileDisciplineIcon';

function ProfileCard(props) {
    const navigate = useNavigate();
    const { account } = props;

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

    const handleNavigateToProfile = () => {
        navigate(`/account/${account.account_slug}`);
    };

    return (
        <Card className="text-center">
            <Card.Header><Card.Title>{account.account_name}</Card.Title></Card.Header>
            <Card.Body>
                <Row>
                    <Col xs={4}>
                        <Image
                            src={account.profile_picture + "?nav=" + Date.now().toString()}
                            roundedCircle
                            className="mb-3"
                            style={{ width: '50px', height: '50px' }}
                            onError={reloadSrc}
                        />
                    </Col>
                    <Col xs={8}>
                        <ProfileDisciplineIcon disciplines={account.profile_disciplines} />
                    </Col>
                </Row>
                <Card.Text>
                    {account.account_slug || 'No slug available.'} - {account.email || 'No email available.'}
                </Card.Text>
                <Button variant="primary" onClick={handleNavigateToProfile}>
                    View Profile
                </Button>
            </Card.Body>
        </Card>
    );
}

export default ProfileCard;