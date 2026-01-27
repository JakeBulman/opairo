import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosService from '../../helpers/axios';
import { getUser } from '../../hooks/user.actions';
import Hashids from 'hashids'
import slugify from 'react-slugify';

function CreateEvent() {
    const navigate = useNavigate();
    const [form, setForm] = useState({});
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState(null);
    const user = getUser();
    const hashids = new Hashids()

    const handleSubmit = (event) => {
        event.preventDefault();
        const createEventForm = event.currentTarget;
        const new_name_slug = `${slugify(form.name)}-${hashids.encode(Date.now())}`

        if (createEventForm.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true); 
        const data = {
            name: form.name,
            name_slug: new_name_slug,
            date: form.date,
            time: form.time,
            organiser: user.public_id, // Assuming the organiser is the logged-in user
        };
        axiosService
        .post('/event/', data,
            {headers: {
                "Content-Type": "multipart/form-data",
                }
            })
        .then(() => {navigate(`/event/${new_name_slug}`)}) //update this to take you to event
        .catch((err) => {
            if (err.message) {
                setError(err.request.response);
            }
        });
    }


    return (
        <Form
        id='create-event-form'
        className="border p-4 rounded bg-dark text-white"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        >
            <Form.Group className="mb-3">
                <Form.Control 
                id='event-name'
                name='event-name'
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                type="text" 
                placeholder="Event Name" 
                className="mb-3" />
                <Form.Control.Feedback type="invalid">
                    Please provide an event name.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control 
                id='event-date'
                name='event-date'
                required
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                type="date" 
                placeholder="Event Date" 
                className="mb-3 "/>
                <Form.Control.Feedback type="invalid">
                    Please provide an event date.
                </Form.Control.Feedback>
            </Form.Group>
                        <Form.Group className="mb-3">
                <Form.Control 
                id='event-date'
                name='event-date'
                required
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                type="time" 
                placeholder="Event Time" 
                className="mb-3 "/>
                <Form.Control.Feedback type="invalid">
                    Please provide an event date.
                </Form.Control.Feedback>
            </Form.Group>
            <div className="text-content text-white">{error && <p>{error}</p>}</div>
            <div className="justify-content-center d-flex pt-4">
            <Button variant="success" type="button" style={{width: 150}} onClick={handleSubmit}>
                Save Changes
            </Button>
            <Button variant="secondary" className="ms-2" style={{width: 150}} onClick={() => navigate(-1)}>
                Cancel
            </Button>
            </div>
        </Form>

    );
};

export default CreateEvent;