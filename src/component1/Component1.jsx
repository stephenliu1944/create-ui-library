import alienPNG from './images/alien.png';
import React from 'react';

export default function Component1() {
    return (
        <div className="component1">
            <p>Component1</p>
            <img src={ alienPNG } />
        </div>
    );
}