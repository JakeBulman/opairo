import React from 'react';
import { Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUser } from "../../hooks/user.actions";

function ProfileDetails(props) {

    const navigate = useNavigate();
    const { account } = props;

    if (!account) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className='d-flex flex-row border-bottom p-5'>
                <Image
                    src={account.profile_picture}
                    roundedCircle
                    width={120}
                    height={120}
                    className="me-5 border border-primary border-2"
                />
                <div className='d-flex flex-column justify-content-center align-self-center mt-2'>
                    <p>{account.account_name}</p>
                    <p>{account.account_slug}</p>
                    {account.public_id === getUser().public_id && (
                    <Button variant="primary" onClick={() => navigate(`/account/${account.public_id}/edit/`)}>
                        Edit
                    </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfileDetails;