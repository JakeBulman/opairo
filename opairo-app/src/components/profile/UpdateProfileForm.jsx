import React, { useState, useRef, useEffect, use } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr'
import { mutate } from 'swr';
import fetcher from '../../helpers/axios';
import { useUserActions } from '../../hooks/user.actions';
import slugify from 'react-slugify';
import { Cropper, CircleStencil, ImageRestriction } from 'react-advanced-cropper'
import 'react-advanced-cropper/dist/style.css';
import 'react-advanced-cropper/dist/themes/compact.css';

function UpdateProfileForm(props) {

    const { public_id } = props;
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState(null);
    const userActions = useUserActions();

    const account_api = useSWR(`/account/${public_id}`, fetcher);
    const account = account_api.data ? account_api.data.data : null;
    const [form, setForm] = useState(account ? account : null);
    const [uploaded_picture, setUploadedPicture] = useState(null);
    const [profile_picture, setProfilePicture] = useState(null);
    // Flag to indicate if the current profile picture is a Dicebear generated one, false = show cropper
    const [isDicebear, setIsDicebear] = useState(profile_picture && profile_picture.includes('dicebear'));
    // const [isDicebear, setIsDicebear] = useState(!uploaded_picture && profile_picture && profile_picture.includes('dicebear'));
    console.log('isDicebear:', isDicebear);
    console.log('profile_picture:', profile_picture);
    console.log('uploaded_picture:', uploaded_picture);

    useEffect(() => {
        if (account_api.data) {
            setForm(account_api.data.data);
            setProfilePicture(account_api.data.data.profile_picture);
            setUploadedPicture(account_api.data.data.profile_picture);
        }
    }, [account_api.data]);

    // useEffect(() => {
    //     if (account_api.data) {
    //         setForm(account_api.data.data);
    //         setProfilePicture(profile_picture ? profile_picture : account_api.data.data.profile_picture);
    //         setUploadedPicture(uploaded_picture ? uploaded_picture : account_api.data.data.profile_picture);
    //     }
    // }, [account_api.data, profile_picture, uploaded_picture]);
    
    useEffect(() => {
        setIsDicebear(profile_picture && profile_picture.includes('dicebear'));
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
        // .then(() => {
        //     mutate(`/account/${public_id}`);
        // });
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

        if (profile_picture !== account.profile_picture) {
            formData.append('profile_picture', profile_picture);
        }

        // mutate(`/account/${public_id}`)
        userActions.edit(formData, account.public_id)
        // .then(() => {mutate(`/account/${public_id}`);})
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
            className='border p-3 rounded' 
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
                <Form.Text className="text-muted text-small">
                    This will be your account's personalised URL. It is based on the account name which you can change later, but it must always be unique across Opairo.
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                    Please provide an account slug.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-3 d-flex flex-column bg-secondary bg-opacity-25 p-2 rounded' controlId='profilePicture'>
                <Form.Label>Profile Picture</Form.Label>
                <div className='justify-content-centre'>
                    <Form.Control onChange={onLoadImage} ref={hiddenFileInput} style={{display: 'none'}} type='file'/>
                </div>
                <div className="d-grid p-3 ">
                    <Button variant="success" onClick={handleClick}>
                        Upload Picture
                    </Button>
                </div>
                {isDicebear ? null :
                <>
                    <div className='justify-content-center d-flex' style={{ aspectRatio: 1/1 }}>
                    <Cropper
                        ref={cropperRef}
                        src={profile_picture}
                        stencilComponent={CircleStencil}
                        defaultSize={defaultSize}
                        imageRestriction={ImageRestriction.fitArea}
                    />
                    </div>
                    <div className="justify-content-center d-flex pt-3">
                        <Button variant="success" type="button" style={{width: 150}} onClick={onCrop}>
                            Apply Cropping
                        </Button>
                        <Button variant="secondary" className="ms-2" style={{width: 150}} onClick={onRemoveCrop}>
                            Discard Cropping
                        </Button>
                    </div>
                    <div className="justify-content-center d-flex p-3">
                        <Button variant="danger" type="button" className="w-100" onClick={onDeletePicture}>
                            Delete Picture
                        </Button>
                    </div>
                </>
                }
                
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