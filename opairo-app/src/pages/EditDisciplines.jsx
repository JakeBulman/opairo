import { React, useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '../helpers/axios';
import Layout from '../components/Layout';
import ProfileDisciplineCard from '../components/profile/ProfileDisciplineCard';
import NewDisciplineModal from '../components/profile/NewDisciplineModal';
import { Row, Col, Spinner } from 'react-bootstrap';

function EditDisciplines() {
    const { public_id } = useParams();
    const [account, setAccount] = useState(null);
    const [userOrderedDisciplines, setUserOrderedDisciplines] = useState(null);

    const { data, error, isLoading } = useSWR(`/account/${public_id}`, fetcher, {onSuccess: (data) => setAccount(data), });
    
    useEffect(() => {
        if (account && account.data) {
            setUserOrderedDisciplines([].concat(account.data.profile_disciplines.sort((a, b) => a.profile_discipline_order - b.profile_discipline_order)));
        }}, [account]);

    function handleReorder(direction, index, userOrderedDisciplines) {
        let targetIndex = direction === 'up' ? index - 1 : index + 1;
        const updateUserOrderedDisciplines = userOrderedDisciplines.map((item, idx) => {
            let expectedIndex = null;

            if (direction === 'up' && index === idx) {
                expectedIndex = targetIndex; //move the lower item up
                console.log('lower item up', item.discipline.discipline_name);
            } 
            else if (direction === 'up' && targetIndex === idx) {
                expectedIndex = index; //move the upper item down
                console.log('upper item down', item.discipline.discipline_name);
            }
            else if (direction === 'down' && index === idx) {
                expectedIndex = targetIndex; //move the upper item down
                console.log('upper item down', item.discipline.discipline_name);
            } 
            else if (direction === 'down' && targetIndex === idx) {
                expectedIndex = index; //move the lower item up
                console.log('lower item up', item.discipline.discipline_name);
            }
            item.profile_discipline_order = expectedIndex;
            if (expectedIndex !== null) {
                return { ...item, profile_discipline_order: expectedIndex };
            }
            return item;
        });
        console.log('updated orders:', updateUserOrderedDisciplines);
        //setUserOrderedDisciplines(updateUserOrderedDisciplines)
        setUserOrderedDisciplines([].concat(updateUserOrderedDisciplines.sort((a, b) => a.profile_discipline_order - b.profile_discipline_order)))
    }

    return (
        <Layout hasNavigationBack>
            <h2 className="text-center text-danger my-4">Disciplines</h2>
            <Row className="g-2 justify-content-evenly">
                {userOrderedDisciplines ? (
                    userOrderedDisciplines.map((discipline, index, userOrderedDisciplines) => (
                        <ProfileDisciplineCard className="p-1" key={discipline.id} discipline={discipline.discipline} index={index} discipline_user_order={discipline.profile_discipline_order} handleReorder={handleReorder} userOrderedDisciplines={userOrderedDisciplines} />
                    ))
                ) : (
                    <div className="p-5 d-flex justify-content-center">
                        <Spinner animation="border" role="status" />
                    </div>
                    
                )}
            </Row>
            {account && account.data ?
            <Row className="justify-content-evenly">
                <Col xs={6} className="d-flex align-items-center justify-content-center mt-3">
                    <NewDisciplineModal account={account} />
                </Col>
            </Row>
            : null}
        </Layout>
    );
}

export default EditDisciplines;