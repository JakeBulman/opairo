import React, { useState, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUserActions } from '../../hooks/user.actions';
import slugify from 'react-slugify';
import { Cropper, CircleStencil, ImageRestriction } from 'react-advanced-cropper'
import 'react-advanced-cropper/dist/style.css';
import 'react-advanced-cropper/dist/themes/compact.css';

function UpdateProfileForm(props) {

    const { account } = props;
    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);
    const [form, setForm] = useState(account);
    const [error, setError] = useState(null);
    const userActions = useUserActions();

    const [profile_picture, setProfilePicture] = useState(account.profile_picture);
    const [uploaded_picture, setUploadedPicture] = useState(account.profile_picture);
    const hiddenFileInput = useRef(null);
    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    const cropperRef = useRef(null);
    const defaultSize = ({ imageSize, visibleArea }) => {
            return {
                width: (visibleArea || imageSize).width,
                height: (visibleArea || imageSize).height,
            };
    }

    const onLoadImage = (event) => {
            // Reference to the DOM input element
            const { files } = event.target;
            // Ensure that you have a file before attempting to read it
            if (files && files[0]) {
                // Create the blob link to the file to optimize performance:
                const blob = URL.createObjectURL(files[0]);
                const file = new File([blob], 'profile_picture.png', { type: 'image' });
                // Get the image type from the extension. It's the simplest way, though be careful it can lead to an incorrect result:
                setForm({ ...form, profile_picture: file });
                setProfilePicture(blob);
                setUploadedPicture(blob);
            }
            // Clear the event target value to give the possibility to upload the same image:
            event.target.value = '';
        };

    const onCrop = () => {
        const cropper = cropperRef.current;
        if (cropper) {
            const canvas = cropper.getCanvas();
            if (canvas) {
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], 'profile_picture.png', { type: 'image' });
                        setForm({ ...form, profile_picture: file });
                        setProfilePicture(URL.createObjectURL(file));
                    }
                });
            }
        }
    }

    const onRemoveCrop = () => {
        setProfilePicture(uploaded_picture);
        setForm({ ...form, profile_picture: uploaded_picture });
        };


    const handleSubmit = async (event) => {
        event.target.disabled = true;
        event.preventDefault();
        const updateProfileForm = event.target;
        if (updateProfileForm.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true);

        // Get the cropped image file in it's current state
        const cropper = cropperRef.current;
        let profile_picture = form.profile_picture;
        if (cropper) {
            const canvas = cropper.getCanvas();
            const blob = await new Promise((resolve) => {
                canvas.toBlob((b) => resolve(b), 'image/png');
            });
            if (blob) {
                profile_picture = new File([blob], 'profile_picture.png', {
                    type: 'image/png'
                });
            }  
        }

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

        if (profile_picture && profile_picture !== account.profile_picture) {
            formData.append('profile_picture', profile_picture);
        }

        userActions.edit(formData, account.public_id)
        .then(() => {navigate(`/account/${form.account_slug}`);}) //insert toaster
        .catch((error) => {
            if (error.message) {
                setError(error.request.response);
                event.target.disabled = false;
            }
        });
    }

    return (
        <Form 
            id='account-edit-form' 
            className='border p-4 rounded' 
            noValidate 
            validated={validated}>
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
                <div className='justify-content-centre'>
                    <Form.Control onChange={onLoadImage} ref={hiddenFileInput} style={{display: 'none'}} type='file'/>
                </div>
                <div className="d-grid">
                    <Button className="mb-3" variant="primary" onClick={handleClick}>
                        Upload Picture
                    </Button>
                </div>
                <div className='justify-content-center d-flex' style={{ aspectRatio: 1/1 }}>
                <Cropper
                    ref={cropperRef}
                    src={profile_picture}
                    stencilComponent={CircleStencil}
                    defaultSize={defaultSize}
                    imageRestriction={ImageRestriction.fitArea}
                />
                </div>
                <div className="justify-content-center d-flex pt-4">
                    <Button variant="primary" type="button" style={{width: 150}} onClick={onCrop}>
                        Apply Cropping
                    </Button>
                    <Button variant="secondary" className="ms-2" style={{width: 150}} onClick={onRemoveCrop}>
                        Cancel
                    </Button>
                </div>
                
                <Form.Control.Feedback type='invalid'>
                    Please select a profile picture.
                </Form.Control.Feedback>
            </Form.Group>
            <div className="text-content text-danger">{error && <p>{error}</p>}</div>
            <div className="justify-content-center d-flex pt-4">
            <Button variant="success" type="button" style={{width: 150}} onClick={handleSubmit}>
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