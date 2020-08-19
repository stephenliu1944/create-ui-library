import '../src/styles/index.less';
import { Component1, Component2 } from '../src/index';

document.querySelector('#app').innerHTML = `
    ${ Component1() }
    <br />
    ${ Component2() }
`;
