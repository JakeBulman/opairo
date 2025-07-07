import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useUserActions } from '../../hooks/user.actions';
import slugify from 'react-slugify';

function RegistrationForm() {
    const [validated, setValidated] = useState(false);
    const [form, setForm] = useState({});
    const [error, setError] = useState(null);
    const UserActions = useUserActions();

    
    const handleSubmit = (event) => {
        event.preventDefault();
        const registrationForm = event.currentTarget;

        if (registrationForm.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true);
        const data = {
            email: form.email,
            password: form.password,
            account_name: form.account_name,
            account_slug: form.account_slug,

        };
        UserActions
        .register(data)
        .catch((err) => {
            if (err.message) {
                setError(err.request.response);
            }
        });
    }

    return (
        <Form
            id="registration-form"
            className="border p-4 rounded"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
        >
            <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter email"
                    required
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">
                    Please provide a valid email.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    required
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">
                    Please provide a password.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Account Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Account Name"
                    required
                    onChange={(e) => setForm({ ...form, account_name: e.target.value, account_slug: slugify(e.target.value) })}
                />
                <Form.Control.Feedback type="invalid">
                    Please provide an account name.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Account URL</Form.Label>
                    <Form.Control
                        type="text"
                        disabled
                        placeholder="Account URL"
                        value={form.account_slug ? form.account_slug : ''}
                        required
                    />
                <Form.Text className="text-muted text-small">
                    This will be your account's personalised URL. It is based on the account name which you can change later, but it must always be unique across Opairo.
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                    Please provide an account slug.
                </Form.Control.Feedback>
            </Form.Group>
            <div className="text-content text-danger">
                {error && <p>{error}</p>}
            </div>
            <Button variant="primary" type="submit">
                Register
            </Button>
        </Form>
    )
}

export default RegistrationForm;