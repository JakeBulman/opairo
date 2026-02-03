import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../hooks/user.actions';
import ProfileDisciplineIcon from './ProfileDisciplineIcon';
import FadeInImage from '../FadeInImage'
import { useMemo } from 'react';

function ProfileDetails(props) {

    const navigate = useNavigate();
    const { account } = props;
    const cacheBuster = useMemo(() => Date.now(), []);

    return (
        <>
            <Row>
                <Col className="d-flex justify-content-center align-items-center">
                    <FadeInImage
                    src={`${account.data.profile_picture}?nav=${cacheBuster}`}
                    roundedCircle
                    width={120}
                    height={120}
                    className="border border-base border-2"
                    />
                </Col>
                <Col className="d-flex justify-content-center align-items-center">
                    <div className='mt-2'>
                        <p>{account.data.account_name}</p>
                        <p>{account.data.account_slug}</p>
                        <ProfileDisciplineIcon disciplines={account.data.profile_disciplines} />
                    </div>
                </Col>
            </Row>
            {getUser() && account.data.public_id === getUser().public_id && (
            <>
            <Row className="mt-3 mb-3">
                <Col className="d-flex justify-content-center align-items-center">
                    <Button variant="outline-base w-100 text-nearwhite fw-bold" onClick={() => navigate(`/account/${account.data.account_slug}/edit/`)}>
                        Edit
                    </Button>
                </Col>
                </Row>
                <Row className="mb-3">
                <Col className="d-flex justify-content-center align-items-center">
                    <Button variant="outline-base w-100 text-nearwhite fw-bold" onClick={() => navigate(`/account/${account.data.account_slug}/disciplines/`)}>
                        My Disciplines
                    </Button>
                </Col>
            </Row>
            </>
            )}
        </>
    );
}

export default ProfileDetails;