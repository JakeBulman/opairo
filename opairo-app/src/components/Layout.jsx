import React from 'react';
import Navigationbar from './Navbar'

function Layout(props) {
    return (
        <div>
            <Navigationbar />
            <div className='container mb-5'>{props.children}</div>
        </div>
    )
}

export default Layout;