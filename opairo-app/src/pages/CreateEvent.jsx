import React from "react";
import CreateEventForm from "../components/event/CreateEventForm";
import Layout from '../components/Layout';

function CreateEvent() {
    return (
        <Layout>
            <div className="container">
                <div className ="row">
                    <div className="col-md-6 d-flex justify-content-center">
                        <div className="content text-center p-2">
                            <h1 className="text-white pb-2">
                                New Event.
                            </h1>
                        </div>
                    </div>
                    <div className="col-md-6 p-2">
                        <CreateEventForm />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default CreateEvent;