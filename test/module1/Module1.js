import { Module1 } from '../../src/index';

describe('describe 1', function() {
    var module = new Module1();
    it('test1', function() {
        expect(module.render()).toMatchSnapshot();
    });
});
