import React from 'react';
import Tilt from 'react-tilt'; // that custom node package for that dynamic pic
import './Logo.css';
import brain from './brain.png';
// simple component since no states, doing function
const Logo = () => {
    return( 
        <div className='ma4 mt0'>
            <Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 150, width: 150 }} >
                <div className="Tilt-inner pa3">
                    <img alt='logo' src={brain} style={{paddingTop: '10px'}}></img>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo; 