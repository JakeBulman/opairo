import { useState } from 'react';
import { Button, Modal, Col, Row, Card, Image, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ProfileDisciplineIcon from './ProfileDisciplineIcon';
import useSWR, { mutate } from 'swr';
import fetcher from '../../helpers/axios';
import axiosService from '../../helpers/axios';
import { getUser } from '../../hooks/user.actions';

function NewDisciplineModal(props) {
    const [show, setShow] = useState(false);
    const disciplines = useSWR(`/disciplines/`, fetcher);
    const account = props?.account;
    const account_discipline_ids = account?.data ? account?.data?.profile_disciplines.map(prof_disc => prof_disc?.discipline).map(disc => disc?.id) : null;
    const discipline_list = disciplines.data ? disciplines?.data?.data?.results : null;
    const filteredDisciplines = account_discipline_ids && discipline_list ? discipline_list.filter(discipline => !account_discipline_ids.includes(discipline?.id)) : null;
    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = (id, event) => {
        event.preventDefault();
        console.log(id)
        const registrationForm = event.currentTarget;

        if (registrationForm.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true);
        const data = {
            discipline_id: id,
            profile_discipline_order: account.data.profile_disciplines.length + 1,
        };
        axiosService.post(`/profile-disciplines/`, data,
            {headers: {
                "Content-Type": "application/json",
                }
            }
        )
        .then(() => {
            setShow(false);
            mutate(
                key => typeof key === 'string' && key.startsWith(`/account/${account.data.account_slug}`),
                undefined,
                { revalidate: true }
            );  
            setError(null);
        })
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
        <Col className="m-2">
            <Button xs={10} onClick={() => handleShow(true)} variant="base" className="w-100  fw-bold">Add Discipline</Button>
        </Col>
        <Col className="m-2">
            <Button xs={10} onClick={() => navigate(-1)} variant="basegrey" className="w-100 fw-bold">Back</Button>
        </Col>
        <Modal className='border border-0' show={show} fullscreen={true} onHide={() => setShow(false)}>
        <Modal.Header closeButton className='text-nearwhite bg-basevdark border-basegrey'>
            <Modal.Title className='p-1'>Add A Discipline</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-nearwhite bg-black border-0'>
            <p className="ms-2">Search below to find a discipline you'd like to add.</p>
            {error && <p className="text-nearwhite">{error}</p>}
            { filteredDisciplines?.length > 0 ? filteredDisciplines?.map((discipline) => (
            <Card className="text-center mb-1 bg-basevdark border border-basegrey text-nearwhite" key={discipline.id}>
                <Card.Body className='p-0'>
                    <Row>
                        <Col xs={3} className="d-flex align-items-center justify-content-center">
                            <ProfileDisciplineIcon disciplines={[{discipline}]} size='60px' />
                        </Col>
                        <Col xs={5} className="d-flex align-items-center justify-content-center fw-bold">
                            {discipline.discipline_name || 'Discipline Not Found.'}
                        </Col>
                        <Col className="d-flex align-items-center justify-content-center">
                            <Form
                            id="registration-form"
                            noValidate
                            validated={validated}
                            onSubmit={(e) => handleSubmit(discipline.id, e)}
                            >
                            <Button variant="base" type="submit">
                                Select
                            </Button>
                            </Form>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            )) 
            : 
            <div className="text-center py-5">
                    <h1>No more disciplines available.</h1>
            </div>
            }

        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center text-nearwhite border border-basegrey border-0 border-top bg-basevdark">
            <Button className="w-100" variant="basedark" onClick={() => setShow(false)}>
                Close
            </Button>
        </Modal.Footer>

        </Modal>
    </>
    );
}

export default NewDisciplineModal;