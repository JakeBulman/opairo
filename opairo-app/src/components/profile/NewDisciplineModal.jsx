import { useState } from 'react';
import { Button, Modal, Col, Row, Spinner, Card, Image, Form } from 'react-bootstrap';
import useSWR from 'swr';
import fetcher from '../../helpers/axios';
import axiosService from '../../helpers/axios';
import { getUser } from '../../hooks/user.actions';

function NewDisciplineModal(props) {
    const [show, setShow] = useState(false);
    const disciplines = useSWR(`/disciplines/`, fetcher);
    const account = props.account;
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = (id, event) => {
        event.preventDefault();
        const registrationForm = event.currentTarget;

        if (registrationForm.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true);
        const data = {
            discipline: id,
            profile: getUser().public_id,
            profile_discipline_order: account.data.data.profile_disciplines.length + 1,
        };
        axiosService.post(`/profile-disciplines/`, data,
            {headers: {
                "Content-Type": "application/json",
                }
            }
        )
        .then(() => {setShow(false);})
        .catch((error) => {
            if (error.message) {
                setError(error.request.response);
            }
        });
    }

    function handleShow() {
        setShow(true);
    }

    return (
    <>
        <Button onClick={() => handleShow(true)} variant="secondary" className="me-2">Add a discipline</Button>
        <Modal show={show} fullscreen={true} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Add a discipline</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p className="ms-2">Search below to find a discipline you'd like to add.</p>
            {error && <p className="text-danger">{error}</p>}
            { disciplines && disciplines.data ? disciplines.data.data.results.map((discipline) => (
            <Card className="text-center mb-1" key={discipline.id}>
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
                        </Col>
                        <Col className="d-flex align-items-center justify-content-center">
                            <Form
                            id="registration-form"
                            noValidate
                            validated={validated}
                            onSubmit={(e) => handleSubmit(discipline.id, e)}
                            >
                            <Button variant="success" type="submit">
                                Select
                            </Button>
                            </Form>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            )) 
            : <Spinner /> }

        </Modal.Body>
        <Modal.Footer className="d-flex">
            <Col>
            <Button className="w-100" variant="secondary" onClick={() => setShow(false)}>
                Close
            </Button>
            </Col>
        </Modal.Footer>

        </Modal>
    </>
    );
}

export default NewDisciplineModal;