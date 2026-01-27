import { useState } from 'react';
import { Form, Button, Image, Row, Col } from 'react-bootstrap';
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
            className="border p-4 rounded bg-dark text-white"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
        >
            <Form.Group>
                <div className="d-grid pb-4">
                    <Button variant="dark" className="border border-1 text-white align-middle">
                        <Image src={ "https://launchpad.37signals.com/assets/icons/google-g-5d1788029612e997baccd82a5608faf3b8b706dde5c0b6a0edb201f76ffdfb3d.svg" }
                        roundedCircle
                        className="p-0"
                        style={{ width: '28px', height: '28px' }}
                        />
                        <div className="d-inline-block ms-2 align-middle">
                            Sign in with Google
                        </div>
                        
                    </Button>
                </div>
            </Form.Group>
            <Form.Group>
                <Row>
                    <Col>
                        <hr></hr>
                    </Col>
                    <Col xs={5} className="text-center text-muted">
                    <small>Or use your email</small>
                        
                    </Col>
                    <Col>
                        <hr></hr>
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group className="mb-3 pt-3">
                <Form.Control
                    type="email"
                    placeholder="Your email, e.g. admin@opairo.com"
                    required
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control
                    type="password"
                    placeholder="Your password"
                    required
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
            </Form.Group>
            {error && <div className="text-white mb-3">{error}</div>}
            <div className="d-grid">
            <Button variant="success" className="mt-3" type="submit">
                Login
            </Button>
            </div>
        </Form>
    );
}

export default LoginForm;