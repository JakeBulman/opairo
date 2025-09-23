import React from 'react';
import { Image, OverlayTrigger, Tooltip } from 'react-bootstrap';

function ProfileDisciplineIcon(props) {
    const { disciplines } = props;

    return (
            <div className='py-1 d-flex justify-content-center align-items-center'>
                {disciplines && disciplines.length > 0 ? (
                    disciplines.map((item) => (
                        <OverlayTrigger
                            key={item.discipline.id}
                            placement="top"
                            overlay={
                                <Tooltip id={`tooltip-${item.discipline.id}`}>
                                    <strong>{item.discipline.discipline_name}</strong>
                                </Tooltip>
                            }
                            >
                            <Image 
                            key={item.discipline.id} 
                            src={item.discipline.discipline_icon}
                            roundedCircle
                            variant="secondary" 
                            className="me-1 border border-danger"
                            style={{ width: '40px', height: '40px' }}
                            >
                                {item.discipline.name}
                            </Image>
                        </OverlayTrigger>
                    ))
                ) : (
                    <p>No disciplines available.</p>
                )}
            </div>
    );
}

export default ProfileDisciplineIcon;