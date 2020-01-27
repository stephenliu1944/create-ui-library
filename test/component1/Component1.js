import { Component1 } from '../../src/index';

describe('Component1', function() {
    var component = new Component1();
    it('render', function() {
        expect(component.render()).toMatchSnapshot();
    });
});
