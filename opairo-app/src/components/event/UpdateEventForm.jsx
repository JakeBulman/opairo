import React, { useState } from 'react';
import { Button, Form, Image, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUserActions } from '../../hooks/user.actions';

function UpdateEventForm(props) {

    const { event } = props;
    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);
    const [form, setForm] = useState(event);
    const [error, setError] = useState(null);
    const userActions = useUserActions();

    const [event_picture, setEventPicture] = useState();

    const handleSubmit = (event) => {
        event.target.disabled = true;
        event.preventDefault();
        const updateEventForm = event.currentTarget;
        if (updateEventForm.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true);

        const data = {
            name: form.name,
            event_picture: form.event_picture,
            description: form.description,
            date: form.date,
            time: form.time,
            location: form.location,
            website: form.website,
        };

        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            if (data[key]) {
                formData.append(key, data[key]);
            }
        });

        if (event_picture) {
            formData.append('event_picture', event_picture);
        }

        userActions.edit(formData, event.public_id)
        .then(() => {navigate(-1);}) //insert toaster
        .catch((error) => {
            if (error.message) {
                setError(error.request.response);
            }
        });
    }


    return (
        <Form 
            id='account-edit-form' 
            className='border p-4 rounded' 
            noValidate 
            validated={validated}>
            <p className="text-center fw-bold">Update an existing event</p>
            <Form.Group className="mb-3">
                <Form.Control
                    required
                    type="text"
                    placeholder="Enter event name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">
                    Please provide a valid event name.
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className='mb-3 d-flex flex-column'>
                <Image
                    src={form.event_picture}
                    roundedCircle
                    width={120}
                    height={120}
                    className='mb-3 border border-primary border-2 align-self-center'
                />
                <div className='justify-content-centre'>
                    <Form.Control onChange={(e) => {setEventPicture(e.target.files[0]);
                        setForm({ ...form, event_picture: URL.createObjectURL(e.target.files[0]) }); }} 
                        className='align-self-centre' type='file'/>
                </div>
                <Form.Control.Feedback type='invalid'>
                    Please select a profile picture.
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter event description"
                    value={form.description || ''}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">
                    Please provide a valid event description.
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Row>
                    <Col>
                    <Form.Control
                        type="date"
                        placeholder="Enter event date"
                        value={form.date || ''}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Please provide a valid event date.
                    </Form.Control.Feedback>
                    </Col>
                    <Col>
                    <Form.Control
                        type="time"
                        placeholder="Enter event time"
                        value={form.time || ''}
                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                        required 
                    />
                    <Form.Control.Feedback type="invalid">
                        Please provide a valid event time.  
                    </Form.Control.Feedback>
                    </Col>
                </Row>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Enter event location"
                    value={form.location || ''}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    required
                />
                <Form.Control.Feedback type="invalid">
                    Please provide a valid event location.
                </Form.Control.Feedback>
            </Form.Group>

            {error && <p className="text-danger">{error}</p>}

            <div className="justify-content-center d-flex pt-4">
            <Button variant="primary" type="button" style={{width: 150}} onClick={handleSubmit}>
                Save Changes
            </Button>
            <Button variant="secondary" className="ms-2" style={{width: 150}} onClick={() => navigate(-1)}>
                Cancel
            </Button>
            </div>
        </Form>
    );
}

export default UpdateEventForm;