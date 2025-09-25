import React from "react";
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '../helpers/axios';
import Layout from '../components/Layout';
import ProfileDisciplineCard from '../components/profile/ProfileDisciplineCard';
import NewDisciplineModal from '../components/profile/NewDisciplineModal';
import { Row, Col } from 'react-bootstrap';

function EditDisciplines() {
    const { public_id } = useParams();
    const account = useSWR(`/account/${public_id}`, fetcher);
    const orderedDisciplines = account && account.data ? [].concat(account.data.data.profile_disciplines).sort((a, b) => a.profile_discipline_order - b.profile_discipline_order ? 1 : -1) : null;

    return (
        <Layout hasNavigationBack>
            <Row className="justify-content-evenly">
                {orderedDisciplines ? (
                    orderedDisciplines.map((discipline) => (
                        <ProfileDisciplineCard key={discipline.id} profile_discipline={discipline.discipline} />
                    ))
                ) : (
                    <p>No disciplines available.</p>
                )}
            </Row>
            <Row className="justify-content-evenly">
                <Col xs={6} className="d-flex align-items-center justify-content-center mt-3">
                    <NewDisciplineModal account={account} />
                </Col>
            </Row>
        </Layout>
    );
}

export default EditDisciplines;