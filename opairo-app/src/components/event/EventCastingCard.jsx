import React from 'react';
import { Card, Button, Image, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../hooks/user.actions';
import axiosService from '../../helpers/axios';

function EventCastingCard(props) {
    const navigate = useNavigate();
    const { casting, event } = props;
    const discipline = casting ? casting.discipline : null;
    const user = getUser();

    console.log(casting.event);
    console.log(user);

    const handleApply = () => {
        const data = {
            cast_role: casting.public_id,
            status: 'p'
        }
        axiosService.post(`/casting-applications/`, data)
        .then(() => {
            navigate(0);
        })
        .catch((err) => {
            console.error(err.response.data);
        });
    };

    return (
        <Card className="text-center h-100">
            <Card.Header><Card.Title>{casting ? casting.name : null}</Card.Title></Card.Header>
            <Card.Body>
                { discipline ?
                <Row>
                    <Col xs={4}>
                        <Image
                            src={discipline && discipline.discipline_icon + "?nav=" + Date.now().toString()}
                            roundedCircle
                            className="mb-3"
                            style={{ width: '50px', height: '50px' }}
                        />
                    </Col>
                    <Col xs={8}>
                        <Card.Text>
                            {casting && casting.discipline.discipline_name }
                        </Card.Text>
                    </Col>
                </Row>
                : null }
                { event && user && user.public_id === event.organiser.public_id ?
                <Button variant="primary" as="a" href={`/event/${event.name_slug}/casting/${casting.public_id}/review`}>
                    Review
                </Button>
                : null }
                { user && user.user_type === '1' ?
                <>
                { casting && casting.casting_applications && casting.casting_applications.some(app => app.applicant.public_id === user.public_id) ?
                <Button variant="secondary" disabled>
                    Applied
                </Button>
                :
                <Button variant="primary" onClick={handleApply}>
                    Apply
                </Button>
                }
                </>
                : null }

            </Card.Body>
        </Card>
    );
}

export default EventCastingCard;