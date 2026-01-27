import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axiosService from '../../helpers/axios';
import useSWR from 'swr'
import { fetcher } from '../../helpers/axios';

function CreateEvent() {
    const navigate = useNavigate();
    const [form, setForm] = useState({});
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState(null);
    const disciplineOptions =  useSWR('/disciplines/', fetcher);
    const event_slug = useParams();
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const createEventForm = event.currentTarget;


        if (createEventForm.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true); 
        const data = {
            name: form.name,
            event: event_slug.name_slug,
            discipline: form.discipline
        };
        axiosService
        .post('/cast/', data,
            {headers: {
                "Content-Type": "multipart/form-data",
                }
            })
        .then(() => {navigate(-1)})
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
                id='role-name'
                name='role-name'
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                type="text" 
                placeholder="Role Name" 
                className="mb-3" />
                <Form.Control.Feedback type="invalid">
                    Please provide a role name.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Select 
                id='discipline'
                name='discipline'
                required
                onChange={(e) => setForm({ ...form, discipline: e.target.value })}
                placeholder="Discipline" 
                className="mb-3 text-muted">
                    <option key="0" value="">Select Discipline</option>
                    {disciplineOptions?.data ? disciplineOptions?.data?.results?.map((discipline, index) => (
                    <option key={index} value={discipline.id}>{discipline.discipline_name}</option>
                    )) : null}
                    
                </Form.Select >
                <Form.Control.Feedback type="invalid">
                    Please provide a discipline.
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