import fatPNG from './images/fat.png';
import PropTypes from 'prop-types';
import React from 'react';
import { getClassPrefix } from 'Utils/common';

export default function Component2(props) {
    const clsPrefix = getClassPrefix('component2', props.classPrefix);

    return (
        <div className={clsPrefix} style={{ ...props.style }}>
            <p>Component2</p>
            <img src={ fatPNG } />
        </div>
    );
}

Component2.propTypes = {
    classPrefix: PropTypes.string,
    style: PropTypes.object
};