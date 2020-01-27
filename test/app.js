import { Component1, Component2 } from '../src/index';

var m1 = new Component1();
var m2 = new Component2();

document.body.innerHTML = `<div>${ m1.render() + m2.render() }</div>`;
