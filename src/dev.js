import Module2, { Module1 } from './index';

var m1 = new Module1();
var m2 = new Module2();

document.body.innerHTML = `<div>${ m1.render() + m2.render() }</div>`;
