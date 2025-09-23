import React from "react";
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '../helpers/axios';
import Layout from '../components/Layout';
import ProfileDisciplineCard from '../components/profile/ProfileDisciplineCard';
import { Row, Col, Button } from 'react-bootstrap';

function EditDisciplines() {
    const { public_id } = useParams();
    const account = useSWR(`/account/${public_id}`, fetcher);

    return (
        <Layout hasNavigationBack>
            <Row className="justify-content-evenly">
                {account.data && account.data.data.profile_disciplines.length > 0 ? (
                    account.data.data.profile_disciplines.map((discipline) => (
                        <ProfileDisciplineCard key={discipline.id} discipline={discipline.discipline} />
                    ))
                ) : (
                    <p>No disciplines available.</p>
                )}
            </Row>
            <Row className="justify-content-evenly">
                <Col xs={6} className="d-flex align-items-center justify-content-center mt-3">
                    <Button variant="success" className="w-100">
                        New Discipline
                    </Button>
                </Col>
            </Row>
        </Layout>
    );
}

export default EditDisciplines;