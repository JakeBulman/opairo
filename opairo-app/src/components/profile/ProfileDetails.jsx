import React from 'react';
import { Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../hooks/user.actions';
import ProfileDisciplines from './ProfileDisciplines';

function ProfileDetails(props) {

    const navigate = useNavigate();
    const { account } = props;

    return (
            <div className='d-flex flex-row border-bottom p-5'>
                <Image
                    src={account.data.profile_picture}
                    roundedCircle
                    width={120}
                    height={120}
                    className="me-5 border border-primary border-2"
                />
                <div className='d-flex flex-column justify-content-center align-self-center mt-2'>
                    <p>{account.data.account_name}</p>
                    <p>{account.data.account_slug}</p>
                    <ProfileDisciplines disciplines={account.data.profile_disciplines} />
                    {getUser() && account.data.public_id === getUser().public_id && (
                    <Button variant="primary" onClick={() => navigate(`/account/${account.data.account_slug}/edit/`)}>
                        Edit
                    </Button>
                    )}
                </div>
            </div>
    );
}

export default ProfileDetails;