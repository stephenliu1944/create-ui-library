import { Component2 } from '../../src/index';

describe('Component2', function() {
    var module = new Component2();
    it('test1', function() {
        expect(module.render()).toMatchSnapshot();
    });
});
