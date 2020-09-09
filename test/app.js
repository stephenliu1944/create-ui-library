import '../src/styles/index.less';
import '../src/publicPath';
import { Component1, Component2 } from '../src/index';
import React from 'react';
import { render } from 'react-dom';

render(
    <div>
        <Component1/>
        <Component2/>
    </div>,
    document.querySelector('#app')
);
