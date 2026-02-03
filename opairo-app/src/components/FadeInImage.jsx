import React from 'react';
import { Image } from 'react-bootstrap';
import { useState } from 'react';

function FadeInImage({ src, ...props }) {
    const [loaded, setLoaded] = useState(false);

    return (
        <Image
        {...props}
        src={src}
        onLoad={() => setLoaded(true)}
        className={`fade-img ${loaded ? "is-loaded" : ""}`}
        />
    );
}

export default FadeInImage;