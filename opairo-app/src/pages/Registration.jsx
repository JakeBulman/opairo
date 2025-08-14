import React from "react";
import { Link } from "react-router-dom";
import RegistrationForm from "../components/authentication/RegistrationForm";
import Layout from '../components/Layout';

function Registration() {
    return (
        <Layout>
            <div className="container">
                <div className ="row">
                    <div className="col-md-6 d-flex justify-content-center">
                        <div className="content text-center p-2">
                            <h1 className="text-primary pb-2">
                                Welcome to Opairo!
                            </h1>
                            <p className="content">
                                Please register to continue.
                                <br />
                                Already have an account? <Link to="/login">Login</Link>
                            </p>
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