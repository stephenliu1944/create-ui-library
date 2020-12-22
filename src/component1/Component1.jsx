import alienPNG from './images/alien.png';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { getClassPrefix } from 'Utils/common';

export default function Component1(props) {
    const clsPrefix = getClassPrefix('component1', props.classPrefix);

    return (
        <div className={classNames(clsPrefix, props.className)} >
            <p>Component1</p>
            <img src={ alienPNG } />
        </div>
    );
}

Component1.propTypes = {
    classPrefix: PropTypes.string,
    className: PropTypes.string
};