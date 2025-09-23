import React from 'react';
import { Button, Image, Card, Row, Col } from 'react-bootstrap';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

function ProfileDisciplineCard(props) {

    const { discipline } = props;
    
    return (
        <Card className="text-center h-100">
            <Card.Header><Card.Title>{discipline.account_name}</Card.Title></Card.Header>
            <Card.Body>
                <Row>
                    <Col xs={2} className="d-flex align-items-center justify-content-center">
                        <Image
                            src={discipline.discipline_icon}
                            roundedCircle
                            style={{ width: '50px', height: '50px' }}
                        />
                    </Col>
                    <Col xs={6} className="d-flex align-items-center justify-content-center">
                        {discipline.discipline_name || 'Discipline Not Found.'}
                    </Col>
                    <Col xs={2} className="d-flex align-items-center justify-content-center">
                        <Button variant="secondary">
                            <FaChevronUp />
                        </Button>
                    </Col>
                    <Col xs={2} className="d-flex align-items-center justify-content-center">
                        <Button variant="secondary">
                            <FaChevronDown />
                        </Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default ProfileDisciplineCard;