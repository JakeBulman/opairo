import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useUserActions } from '../../hooks/user.actions';

function LoginForm() {
    const [validated, setValidated] = useState(false);
    const [form, setForm] = useState({});
    const [error, setError] = useState(null);
    const userActions = useUserActions();

    const handleSubmit = (event) => {
        event.preventDefault();
        const loginForm = event.currentTarget;

        if (loginForm.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true);
        const data = {
            email: form.email,
            password: form.password,
        };
        userActions
            .login(data)
            .catch((err) => {
                if (err.message) {
                    setError(err.request.response);
                }
            });
    };

    return (
        <Form
            id="login-form"
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
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    required
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
            </Form.Group>
            {error && <div className="text-danger mb-3">{error}</div>}
            <Button variant="primary" type="submit">
                Login
            </Button>
        </Form>
    );
}

export default LoginForm;