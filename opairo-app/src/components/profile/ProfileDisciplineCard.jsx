import React from 'react';
import { Button, Image, Card, Row, Col } from 'react-bootstrap';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

function ProfileDisciplineCard(props) {

    const discipline = props.discipline;
    const index = props.index;
    const handleReorder = props.handleReorder;
    const userOrderedDisciplines = props.userOrderedDisciplines || [];
    const discipline_user_order = props.discipline_user_order;
    // console.log('ProfileDisciplineCard props:', discipline_user_order);

    
    return (
        <Card className="text-center h-100 bg-dark text-white mb-2">
            <Card.Body>
                <Row>
                    <Col xs={2} className="d-flex align-items-center justify-content-center">
                        <Image
                            src={discipline.discipline_icon}
                            roundedCircle
                            style={{ width: '50px', height: '50px' }}
                        />
                    </Col>
                    <Col xs={6} className="d-flex align-items-center justify-content-center fw-bold">
                        {discipline.discipline_name || 'Discipline Not Found.'}
                        {index !== undefined ? <p className="text-muted" style={{ fontSize: '0.75rem' }}>Order: {index}</p> : null}
                        {discipline_user_order !== undefined ? <p className="text-muted" style={{ fontSize: '0.75rem' }}>Order2: {discipline_user_order}</p> : null}
                    </Col>
                    <Col xs={2} className="d-flex align-items-center justify-content-center">
                        <Button variant="secondary" onClick={() => handleReorder && handleReorder('up', index, userOrderedDisciplines)} disabled={index === 0}>
                            <FaChevronUp />
                        </Button>
                    </Col>
                    <Col xs={2} className="d-flex align-items-center justify-content-center">
                        <Button variant="secondary" onClick={() => handleReorder && handleReorder('down', index, userOrderedDisciplines)} disabled={index === userOrderedDisciplines.length - 1}>
                            <FaChevronDown />
                        </Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default ProfileDisciplineCard;