import React from "react";
import Layout from '../components/Layout';
import { Row, Stack } from 'react-bootstrap';
import useSWR from 'swr'
import ProfileCard from '../components/profile/ProfileCard';
import { fetcher } from '../helpers/axios';


function Home() {
    // const account = useSWR('/account/?limit=9', fetcher);
    return (
        <Layout>
            <div className="col-md-6 d-flex justify-content-center">
                <div className="content text-center p-2">
                    <h1 className="text-nearwhite pb-2">
                        Opairo.
                    </h1>
                </div>
            </div>
        </Layout>
    );
}

export default Home