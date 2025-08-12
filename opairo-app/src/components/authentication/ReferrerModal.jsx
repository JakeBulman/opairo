import { useState } from 'react';
import { Button, Modal, Col } from 'react-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

function ReferrerModal({ handleModal }) {
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState([]);
    
    function handleSave() {
        handleModal(selected[0].account_slug);
        setShow(false);
    }

    const handleSearch = async (query) => {
        setIsLoading(true);
        const Response = await fetch(`http://localhost:8000/account/?query=${query}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        });
        const json = await Response.json();
        setOptions(json.results);
        setIsLoading(false);
    }

    const filterBy = () => true;

    function handleShow() {
        setShow(true);
    }

    return (
    <>
        <Button onClick={() => handleShow(true)} className="me-2">Find Referrer</Button>
        <Modal show={show} fullscreen={true} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Find Referrer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Search below to find a referrer by their unique URL.
            <AsyncTypeahead
                onChange={setSelected}
                autoFocus
                filterBy={filterBy}
                id="async-example"
                isLoading={isLoading}
                labelKey="account_slug"
                minLength={4}
                onSearch={handleSearch}
                options={options}
                placeholder="Search for an Opairo user URL..."
                renderMenuItemChildren={(option) => (
                    <>
                    <img
                        alt={option.account_name}
                        src={option.profile_picture}
                        style={{
                        height: '24px',
                        marginRight: '10px',
                        width: '24px',
                        }}
                    />
                    <span>{option.account_slug} - {option.account_name}</span>
                    </>
                )}
            />
        </Modal.Body>
        <Modal.Footer className="d-flex">
            <Col>
            <Button className="w-100" variant="primary" onClick={handleSave}>
                Save Changes
            </Button>
            </Col>
            <Col>
            <Button className="w-100" variant="secondary" onClick={() => setShow(false)}>
                Close
            </Button>
            </Col>
        </Modal.Footer>

        </Modal>
    </>
    );
}

export default ReferrerModal;