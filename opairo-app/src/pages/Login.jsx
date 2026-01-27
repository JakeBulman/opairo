import React from "react";
import LoginForm from "../components/authentication/LoginForm";
import Layout from '../components/Layout';

function Login() {
    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 d-flex justify-content-center">
                        <div className="content text-center p-2">
                            <h1 className="text-white pb-2">
                                Sign in.
                            </h1>
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