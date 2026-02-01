import React, { useState, useRef, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUserActions } from '../../hooks/user.actions';
import slugify from 'react-slugify';
import { Cropper, CircleStencil, ImageRestriction } from 'react-advanced-cropper'
import 'react-advanced-cropper/dist/style.css';
import 'react-advanced-cropper/dist/themes/compact.css';
import { mutate } from 'swr';

function UpdateProfileForm(props) {

    const { account, public_id } = props;
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState(null);
    const userActions = useUserActions();

    const [form, setForm] = useState(account ? account : null);
    const [uploaded_picture, setUploadedPicture] = useState(account ? account.profile_picture : null);
    const [profile_picture, setProfilePicture] = useState(account ? account.profile_picture + "?nav=" + Date.now().toString() : null);
    // Flag to indicate if the current profile picture is a Dicebear generated one, false = show cropper
    const [isDicebear, setIsDicebear] = useState((profile_picture && profile_picture.includes('dicebear')) || profile_picture === null ? true : false);

    console.log('Rendering UpdateProfileForm with profile_picture:', profile_picture, 'isDicebear:', isDicebear, 'uploaded_picture:', uploaded_picture);
    
    useEffect(() => {
        setIsDicebear((profile_picture && profile_picture.includes('dicebear')) || profile_picture === null ? true : false);
    }, [profile_picture]);


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
                setForm({ ...form, profile_picture: file });
                setProfilePicture(blob);
                setUploadedPicture(blob);
                setIsDicebear(false);
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
        const cropper = cropperRef.current;
        if (cropper) {
            cropper.reset();
        }
        };

    const onDeletePicture = () => {
        userActions.deleteProfilePicture(account.public_id)
        setProfilePicture(null);
        setUploadedPicture(null);
        setForm({ ...form, profile_picture: null });
        setIsDicebear(true);

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
        if (isDicebear === false && profile_picture) {
            if (cropper) {
                const canvas = cropper.getCanvas({
                    height: 256,
                    width: 256,
                    });
                const blob = await new Promise((resolve) => {
                    canvas.toBlob((b) => resolve(b), 'image/png');
                });
                if (blob) {
                    profile_picture = new File([blob], 'profile_picture.png', {
                        type: 'image/png'
                    });
                }  
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

        if (profile_picture !== account.profile_picture && isDicebear === false) {
            formData.append('profile_picture', profile_picture);
        }

        userActions.edit(formData, account.public_id)
        .then(() => {mutate(`/account/${public_id}`,true);})
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
            className='p-3' 
            noValidate 
            validated={validated}>
            <Form.Group className="mb-3">
                <Form.Label>Account Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Account Name"
                    value={form && form.account_name ? form.account_name : ''}
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
                        value={form && form.account_slug ? form.account_slug : ''}
                        required
                    />
                <Form.Text className="text-nearwhite text-small">
                    This is your account's personalised URL. It is based on the account name which you can change, but it must always be unique across Opairo.
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                    Please provide an account slug.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-3 d-flex flex-column bg-basedark p-2 rounded' controlId='profilePicture'>
                <Form.Label>Profile Picture</Form.Label>
                <div className='justify-content-centre'>
                    <Form.Control onChange={onLoadImage} ref={hiddenFileInput} style={{display: 'none'}} type='file'/>
                </div>
                <div className="d-grid px-5 pb-3">
                    <Button size="sm" variant="base" onClick={handleClick}>
                        Upload Picture
                    </Button>
                </div>
                {isDicebear ? null :
                <>
                    <div className='px-5'>
                        <div className='justify-content-center d-flex' style={{ aspectRatio: 1/1 }}>
                        <Cropper
                            ref={cropperRef}
                            src={profile_picture}
                            // src={profile_picture + "?nav=false"}
                            stencilComponent={CircleStencil}
                            defaultSize={defaultSize}
                            imageRestriction={ImageRestriction.fitArea}
                            crossOrigin="anonymous"
                        />
                        </div>
                    </div>
                    <div className='px-5'>
                        <div className="justify-content-center d-flex pt-3">
                            <Button size="sm" variant="base" type="button" style={{width: 150}} onClick={onCrop}>
                                Apply
                            </Button>
                            <Button size="sm" variant="outline-base text-nearwhite" className="ms-2" style={{width: 150}} onClick={onRemoveCrop}>
                                Discard
                            </Button>
                        </div>
                        <div className="justify-content-center d-flex py-3">
                            <Button size="sm" variant="danger" type="button" className="w-100" onClick={onDeletePicture}>
                                Delete Picture
                            </Button>
                        </div>
                    </div>
                </>
                }
                <Form.Control.Feedback type='invalid'>
                    Please select a profile picture.
                </Form.Control.Feedback>
            </Form.Group>
            <div className="text-content text-white">{error && <p>{error}</p>}</div>
            <div>
            <div className="justify-content-center d-flex pb-4">
                <Button variant="base" type="button" className="me-1 w-50" onClick={handleSubmit}>
                    Save Changes
                </Button>
                <Button variant="outline-base text-nearwhite" className="ms-1 w-50" onClick={() => navigate(-1)}>
                    Cancel
                </Button>
            </div>
            </div>
        </Form>
    )
}

export default UpdateProfileForm;