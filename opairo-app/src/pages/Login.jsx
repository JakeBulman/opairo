import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/authentication/LoginForm";
import Layout from '../components/Layout';

function Login() {
    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 d-flex justify-content-center">
                        <div className="content text-center p-2">
                            <h1 className="text-primary pb-2">
                                Welcome to Opairo!
                            </h1>
                            <p className="content">
                                Please login to continue.
                                <br />
                                Don't have an account? <Link to="/register">Register</Link>
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6 p-2">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Login;