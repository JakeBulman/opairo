import React from 'react';
import { Card, Button, Image, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function EventCastingCard(props) {
    const navigate = useNavigate();
    const { cast } = props;
    const discipline = cast ? cast.discipline : null;

    const handleNavigateToEvent = () => {
        navigate(`/event/${cast.event}`);
    };

    return (
        <Card className="text-center h-100">
            <Card.Header><Card.Title>{cast ? cast.name : null}</Card.Title></Card.Header>
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
                            {cast && cast.discipline.discipline_name }
                        </Card.Text>
                    </Col>
                </Row>
                : null }
                <Button variant="primary" onClick={handleNavigateToEvent}>
                    View Event
                </Button>
            </Card.Body>
        </Card>
    );
}

export default EventCastingCard;