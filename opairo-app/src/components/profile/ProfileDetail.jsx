import React from 'react';
import { Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function ProfileDetails(props) {

    const navigate = useNavigate();
    const { user } = props;

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className='d-flex flex-row border-bottom p-5'>
                <Image
                    src={user.profile_picture}
                    roundedCircle
                    width={120}
                    height={120}
                    className="me-5 border border-primary border-2"
                />
                <div className='d-flex flex-column justify-content-center align-self-center mt-2'>
                    <p>{user.account_name}</p>
                    <p>{user.account_slug}</p>
                    <Button variant='primary' onClick={() => navigate(`/profile/${user.public_id}/edit/`)}>
                        Edit
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ProfileDetails;