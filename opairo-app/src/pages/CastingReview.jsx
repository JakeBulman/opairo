import React from 'react';
import { Button } from 'react-bootstrap';
import {useParams, Link} from 'react-router-dom';
import Layout from '../components/Layout';
import useSWR, { mutate } from 'swr';
import axiosService, {fetcher} from '../helpers/axios';
import { Row, Col, Spinner, Dropdown } from 'react-bootstrap';
import ProfileCard from '../components/profile/ProfileCard';

function CastingReview() {
    const { name_slug, casting_id } = useParams();
    const event = useSWR(`/event/${name_slug}/`, fetcher);
    const casting = useSWR(`/cast/${casting_id}/`, fetcher);

    if (casting.data) {
        console.log(casting.data.casting_applications);
    }

    const handleStatusChange = async (applicationId, newStatus) => {
        const key = `/cast/${casting_id}/`;

        mutate(
            key,
            (currentData) => ({
            ...currentData,
            casting_applications: currentData.casting_applications.map(app =>
                app.public_id === applicationId
                ? { ...app, status: newStatus }
                : app
            ),
            }),
            false // don't revalidate yet
        );

        try {
            await axiosService.patch(
                `/casting-applications/${applicationId}/`,
                { status: newStatus },
                {
                    headers: {
                    'Content-Type': 'application/json',
                    },
                }
            );

            mutate(key); // revalidate from server
        } catch (error) {
            console.error(error);
            mutate(key); // rollback by refetching
        }
    };


    return (
        <Layout hasNavigationBack>
            <div className="col-md-6 d-flex justify-content-center">
                <div className="content text-center p-2">
                    <h1 className="text-white pb-2">
                        Casting Review.
                    </h1>
                </div>
            </div>
            <Row className="justify-content-evenly">
                <div className="d-grid pb-3">
                    <Button as={Link} to={`/event/${name_slug}/casting/`} className="mt-3" variant="secondary" type="submit">
                        Back to Casting
                    </Button>
                </div> 
            </Row>
            <Row className="justify-content-evenly">
                {casting.isLoading ? <Spinner animation="border" /> : null}
                { casting.data && casting.data.casting_applications.length > 0 ? (
                    casting.data.casting_applications.map((app, index) => (
                        <Row key={index} className="justify-content-evenly p-3 mb-3">
                            <Col xs={12} className="text-center mb-2">
                                <h5>Application {index + 1}</h5>
                                <p>Submitted on: {new Date(app.created_at).toLocaleDateString()} - {new Date(app.created_at).toLocaleTimeString()}</p>
                                <ProfileCard account={app.applicant} />
                                {/* a dropdown to select application status */}
                            </Col>
                                <Dropdown className="mt-3 w-100">
                                    <Dropdown.Toggle
                                        disabled={casting.isLoading}
                                        variant={
                                            app.status === 'p'
                                            ? 'primary'
                                            : app.status === 'a'
                                            ? 'success'
                                            : 'danger'
                                        }
                                        className="w-100"
                                        >
                                        Status: {app.status === 'p' ? 'Pending' : app.status === 'a' ? 'Accepted' : 'Rejected'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item
                                        onClick={() => handleStatusChange(app.public_id, 'p')}
                                        >
                                        Pending
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                        onClick={() => handleStatusChange(app.public_id, 'a')}
                                        >
                                        Accepted
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                        onClick={() => handleStatusChange(app.public_id, 'r')}
                                        >
                                        Rejected
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>

                            </Row>
                    ))
                ) : (
                    <Col sm={9} className="text-center">
                        <p>No application found.</p>
                    </Col>
                )}
            </Row>
        </Layout>
    )
}

export default CastingReview;