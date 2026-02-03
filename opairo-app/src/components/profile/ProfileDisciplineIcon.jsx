import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import FadeInImage from '../FadeInImage'
import fallbackPicture from '../../assets/white-bg.png';

function ProfileDisciplineIcon(props) {
    const { disciplines, size } = props;
    const iconSize = size ? size : '40px'

    return (
            <div className='py-1 d-flex flex-wrap justify-content-start align-items-center'>
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
                            <FadeInImage 
                            key={item.discipline.id} 
                            src={item.discipline.discipline_icon}
                            roundedCircle
                            variant="secondary" 
                            className="me-1 mb-1 border border-1 border-base"
                            style={{ width: iconSize, height: iconSize }}
                            >
                                {item.discipline.name}
                            </FadeInImage>
                        </OverlayTrigger>
                    ))
                ) : 
                <FadeInImage
                    src={fallbackPicture}
                    roundedCircle
                    variant="secondary" 
                    className="me-1 mb-1 border border-1 border-base"
                    style={{ width: iconSize, height: iconSize }}
                />}
            </div>
    );
}

export default ProfileDisciplineIcon;