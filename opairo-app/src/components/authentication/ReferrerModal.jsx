import { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

const SEARCH_URI = 'https://api.github.com/search/users';

function ReferrerModal() {
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);

    const handleSearch = (query) => {
        setIsLoading(true);

        fetch(`${SEARCH_URI}?q=${query}+in:login&page=1&per_page=50`)
        .then((resp) => resp.json())
        .then(({ items }) => {
        setOptions(items);
        setIsLoading(false);
        });
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
            Search below to find your referrer.
            <AsyncTypeahead
                filterBy={filterBy}
                id="async-example"
                isLoading={isLoading}
                labelKey="login"
                minLength={3}
                onSearch={handleSearch}
                options={options}
                placeholder="Search for a Github user..."
                renderMenuItemChildren={(option) => (
                    <>
                    <img
                        alt={option.login}
                        src={option.avatar_url}
                        style={{
                        height: '24px',
                        marginRight: '10px',
                        width: '24px',
                        }}
                    />
                    <span>{option.login}</span>
                    </>
                )}
            />
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
                Close
            </Button>
            <Button variant="primary" onClick={() => setShow(false)}>
                Save Changes
            </Button>
        </Modal.Footer>

        </Modal>
    </>
    );
}

export default ReferrerModal;