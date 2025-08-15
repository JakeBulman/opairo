import { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useUserActions } from '../../hooks/user.actions';
import ReferrerModal from './ReferrerModal'; // Import the ReferrerModal component
import slugify from 'react-slugify';

function RegistrationForm() {
    const [validated, setValidated] = useState(false);
    const [form, setForm] = useState({});
    const [error, setError] = useState(null);
    const UserActions = useUserActions();
    const [modalValue, setModalValue] = useState(null);
    const [switchState, setSwitchState] = useState(true);
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const registrationForm = event.currentTarget;

        if (registrationForm.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true);
        const data = {
            email: form.email,
            email_flag: switchState, //switch is controlled component
            password: form.password,
            account_name: form.account_name,
            account_slug: form.account_slug,
            referrer: form.referrer || null, // Optional field for referrer
        };
        UserActions
        .register(data)
        .catch((err) => {
            if (err.message) {
                setError(err.request.response);
            }
        });
    }

    function handleModalValue(modalData) {
        setModalValue(modalData)
        setForm({ ...form, referrer: modalData })
    }

    const handleSwitchChange=(e)=>{
        setSwitchState(e.target.checked)
        setForm({ ...form, email_flag: e.target.checked }, () => {console.log(form.email_flag) })
    }

    return (
        <Form
            id="registration-form"
            className="border p-4 rounded"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
        >
            <p className="text-center fw-bold">A few details we need from you...</p>
            <Form.Group className="mb-3">
                <Form.Control
                    id="email"
                    type="email"
                    placeholder="Your email, e.g. admin@opairo.com"
                    autocomplete="email"
                    required
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">
                    Please provide a valid email.
                </Form.Control.Feedback>            
                <Form.Switch className="pt-2 text-center text-muted text small"
                    id="email-flag"
                    label="I want to hear more about Opairo by email."
                    checked={switchState}
                    // defaultChecked={true}
                    onChange={handleSwitchChange}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control
                    id="password"
                    type="password"
                    placeholder="Your password"
                    required
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">
                    Please provide a password.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control
                    id="account-name"
                    type="text"
                    placeholder="Your account name"
                    required
                    onChange={(e) => setForm({ ...form, account_name: e.target.value, account_slug: slugify(e.target.value) })}
                />
                <Form.Control.Feedback type="invalid">
                    Please provide an account name.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-4">
                    <Form.Control
                        id="account-slug"
                        type="text"
                        min="4"
                        disabled
                        placeholder="Your account URL"
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
            <Form.Group className="mb-4">
                <InputGroup>
                <Form.Control
                    id="referrer"
                    type="text"
                    disabled
                    placeholder="Referrer (Optional) ->"
                    value={modalValue}
                />
                <ReferrerModal handleModal={handleModalValue} />
                </InputGroup>
                <Form.Text className="text-muted text-small">
                    If you were referred by someone, you can enter their account url here.
                </Form.Text>
            </Form.Group>
            <div className="text-content text-danger">
                {error && <p>{error}</p>}
            </div>
            <div className="d-grid">
            <Button className="mt-3" variant="success" type="submit">
                Register
            </Button>
            </div>
        </Form>
    )
}

export default RegistrationForm;