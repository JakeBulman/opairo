import React from 'react';
import { Card, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function ProfileCard(props) {
    const navigate = useNavigate();
    const { user } = props;

    const handleNavigateToProfile = () => {
        navigate(`/profile/${user.account_slug}`);
    };

    return (
        <Card className="text-center">
            <Card.Header>Profile</Card.Header>
            <Card.Body>
                <Image
                    src={user.profile_picture || 'https://i.pravatar.cc/150'}
                    roundedCircle
                    className="mb-3"
                    style={{ width: '50px', height: '50px' }}
                />
                <Card.Title>{user.account_name}</Card.Title>
                <Card.Text>
                    {user.bio || 'No bio available.'}
                </Card.Text>
                <Button variant="primary" onClick={handleNavigateToProfile}>
                    View Profile
                </Button>
            </Card.Body>
        </Card>
    );
}

export default ProfileCard;