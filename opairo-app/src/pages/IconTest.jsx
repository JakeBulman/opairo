import pic1 from '../assets/acoustic-guitar.png';
import pic2 from '../assets/electric-guitar.png';
import pic3 from '../assets/violin.png';
import pic4 from '../assets/cello.png';
import pic5 from '../assets/singer.png';
import pic6 from '../assets/saxaphone.png';
import pic7 from '../assets/trumpet.png';
import pic8 from '../assets/tuba.png';
import Layout from '../components/Layout';
import { Image, Col, Row, Container } from 'react-bootstrap';

function Test() {
    return (
        <Layout>
            <Container className="bg-dark p-5">
                <Container className="bg-dark p-3">
                    <Row className="mb-2">
                        <Col className="text-center">
                        <Image src={ pic1 }
                        roundedCircle
                        style={{ width: '44px', height: '44px' }}
                        className="border border-3 border-white"
                        />
                        </Col>
                        <Col className="text-center">
                        <Image src={ pic2 }
                        roundedCircle
                        style={{ width: '44px', height: '44px' }}
                        className="border border-3 border-white"
                        />
                        </Col>
                        <Col className="text-center">
                        <Image src={ pic3 }
                        roundedCircle
                        style={{ width: '44px', height: '44px' }}
                        className="border border-3 border-white"
                        />
                        </Col>
                        <Col className="text-center">
                        <Image src={ pic4 }
                        roundedCircle
                        style={{ width: '44px', height: '44px' }}
                        className="border border-3 border-white"
                        />
                        </Col>
                        </Row>
                        <Row>
                        <Col className="text-center">
                        <Image src={ pic5 }
                        roundedCircle
                        style={{ width: '44px', height: '44px' }}
                        className="border border-3 border-white"
                        />
                        </Col>
                        <Col className="text-center">
                        <Image src={ pic6 }
                        roundedCircle
                        style={{ width: '44px', height: '44px' }}
                        className="border border-3 border-white"
                        />
                        </Col>
                        <Col className="text-center">
                        <Image src={ pic7 }
                        roundedCircle
                        style={{ width: '44px', height: '44px' }}
                        className="border border-3 border-white"
                        />
                        </Col>
                        <Col className="text-center">
                        <Image src={ pic8 }
                        roundedCircle
                        style={{ width: '44px', height: '44px' }}
                        className="border border-3 border-white"
                        />
                        </Col>
                    </Row>
                </Container>
            </Container>
        </Layout>
    );
}

export default Test;