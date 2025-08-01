import React, { useState } from 'react';
import { Button, Form, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { useUserActions } from '../../hooks/user.actions';
// import { Context } from '../Layout';
import slugify from 'react-slugify';

function UpdateProfileForm(props) {

    const { account } = props;
    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);
    const [form, setForm] = useState(account);
    const [error, setError] = useState(null);
    const userActions = useUserActions();

    const [profile_picture, setProfilePicture] = useState();

    const handleSubmit = (event) => {
        event.preventDefault();
        const updateProfileForm = event.currentTarget;
        if (updateProfileForm.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true);

        const data = {
            account_name: form.account_name,
            account_slug: form.account_slug,
        };

        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            if (data[key]) {
                formData.append(key, data[key]);
            }
        });

        if (profile_picture) {
            formData.append('profile_picture', profile_picture);
        }

        userActions.edit(formData, account.public_id)
        .then(() => {navigate(0);}) //insert toaster
        .catch((error) => {
            if (error.message) {
                setError(error.request.response);
            }
        });
    }


    


    return (
        <Form id='account-edit-form' className='border p-4 rounded' noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Account Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Account Name"
                    value={form.account_name ? form.account_name : ''}
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
            <Form.Group className='mb-3 d-flex flex-column'>
                <Form.Label>Profile Picture</Form.Label>
                <Image
                    src={form.profile_picture}
                    //src={profile_picture ? profile_picture : account.profile_picture}
                    roundedCircle
                    width={120}
                    height={120}
                    className='mb-3 border border-primary border-2 align-self-center'
                />
                <div className='justify-content-centre'>
                    <Form.Control onChange={(e) => {setProfilePicture(e.target.files[0]);
                        setForm({ ...form, profile_picture: URL.createObjectURL(e.target.files[0]) }); }
                    } className='align-self-centre' type='file'/>
                </div>
                
                <Form.Control.Feedback type='invalid'>
                    Please select a profile picture.
                </Form.Control.Feedback>
            </Form.Group>
            <div className="text-content text-danger">{error && <p>{error}</p>}</div>
            <div className="justify-content-end d-flex">
            <Button variant="primary" type="submit" style={{width: 150}}>
                Save Changes
            </Button>
            <Button variant="secondary" className="ms-2" style={{width: 150}} onClick={() => navigate(-1)}>
                Cancel
            </Button>
            </div>
        </Form>
    )
}

export default UpdateProfileForm;