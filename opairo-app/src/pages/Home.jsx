import React from "react";
import Layout from '../components/Layout';
import { Row, Stack } from 'react-bootstrap';
import useSWR from 'swr'
import ProfileCard from '../components/profile/ProfileCard';
import { fetcher } from '../helpers/axios';


function Home() {
    const account = useSWR('/account/?limit=9', fetcher);
    return (
        <Layout>
            <Row>
                    <div className="col-md-6 d-flex justify-content-center">
                        <div className="content text-center p-2">
                            <h1 className="text-white pb-2">
                                Profiles.
                            </h1>
                        </div>
                    </div>
                <Stack>
                    {account.data ? (
                    account.data && account.data.results.map((account, index) => (
                    <ProfileCard key={index} account={account}/>
                    ))
                    ) : (
                    [...Array(9).keys()].map(key =>  
                    <ProfileCard key={key} account={account}/>
                    )
                    )}
                </Stack>
            </Row>
        </Layout>
    );
}

export default Home