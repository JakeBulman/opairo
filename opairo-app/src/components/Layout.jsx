import React from 'react';
import Navigationbar from './Navbar'

function Layout(props) {
    return (
        <div className='min-vh-100 text-white bg-green-300'>
            <Navigationbar />
            <div className='container h-100'>{props.children}</div>
        </div>
    )
}

export default Layout;