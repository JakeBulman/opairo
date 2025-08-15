import React from "react";
import RegistrationForm from "../components/authentication/RegistrationForm";
import Layout from '../components/Layout';

function Registration() {
    return (
        <Layout>
            <div className="container">
                <div className ="row">
                    <div className="col-md-6 d-flex justify-content-center">
                        <div className="content text-center p-2">
                            <h1 className="text-danger pb-2">
                                Welcome.
                            </h1>
                        </div>
                    </div>
                    <div className="col-md-6 p-2">
                        <RegistrationForm />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Registration;