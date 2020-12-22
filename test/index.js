import React from 'react';
import { render } from 'react-dom';
import { Component1, Component2 } from '../src/index';

render(
    <div>
        <Component1 className="myclass" />
        <Component2 style={{ width: 400 }} />
    </div>,
    document.querySelector('#app')
);