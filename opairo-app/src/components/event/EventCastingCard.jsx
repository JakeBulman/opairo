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

    const handleApply = () => {
        const data = {
            cast_role: casting?.public_id,
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
        <Card className="text-center h-100 bg-dark text-white">
            <Card.Body>
                { discipline ?
                <Row className="align-items-center">
                    <Col xs={3}>
                        <Image
                            src={discipline?.discipline_icon + "?nav=" + Date.now().toString()}
                            roundedCircle
                            style={{ width: '50px', height: '50px' }}
                        />
                    </Col>
                    <Col xs={5} className='p-0'>
                        <Card.Text>
                            {casting?.name} - {casting?.discipline?.discipline_name}
                        </Card.Text>
                    </Col>
                    <Col xs={4}>
                        { user?.public_id === event?.organiser?.public_id ?
                        <Button variant="primary" size="sm" as="a" href={`/event/${event?.name_slug}/casting/${casting?.public_id}/review`}>
                            Review
                        </Button>
                        : null }
                        { user?.user_type === '1' ?
                        <>
                        { casting?.casting_applications && casting?.casting_applications.some(app => app?.applicant?.public_id === user?.public_id) ?
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
                    </Col>
                </Row>
                : null }


            </Card.Body>
        </Card>
    );
}

export default EventCastingCard;