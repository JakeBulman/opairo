import React from 'react';
import { Button, Image, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../hooks/user.actions';
import ProfileDisciplineIcon from './ProfileDisciplineIcon';

function ProfileDetails(props) {

    const navigate = useNavigate();
    const { account } = props;

    return (
        <>
            <Row>
                <Col className="d-flex justify-content-center align-items-center">
                    <Image
                        src={account.data.profile_picture}
                        roundedCircle
                        width={120}
                        height={120}
                        className="border border-primary border-2"
                    />
                </Col>
                <Col className="d-flex justify-content-center align-items-center">
                    <div className='d-flex flex-column justify-content-center align-self-center mt-2'>
                        <p>{account.data.account_name}</p>
                        <p>{account.data.account_slug}</p>
                        <ProfileDisciplineIcon disciplines={account.data.profile_disciplines} />
                    </div>
                </Col>
            </Row>
            {getUser() && account.data.public_id === getUser().public_id && (
            <Row className="mt-3 mb-3">
                <Col className="d-flex justify-content-center align-items-center">
                    <Button variant="primary" style={{width: 150}} onClick={() => navigate(`/account/${account.data.account_slug}/edit/`)}>
                        Edit
                    </Button>
                </Col>
                <Col className="d-flex justify-content-center align-items-center">
                    <Button variant="secondary" style={{width: 150}} onClick={() => navigate(`/account/${account.data.account_slug}/disciplines/`)}>
                        Disciplines
                    </Button>
                </Col>
            </Row>
            )}
        </>
    );
}

export default ProfileDetails;