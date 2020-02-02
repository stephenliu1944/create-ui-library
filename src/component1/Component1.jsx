import alienPNG from './images/alien.png';
import React from 'react';

export default function() {
    return (
        <div className="component1">
            <p>Component1</p>
            <img src={ alienPNG } />
        </div>
    );
}