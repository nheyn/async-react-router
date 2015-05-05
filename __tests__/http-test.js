jest.dontMock("babel/polyfill");
require('babel/polyfill');

/*
jest.dontMock('es6-shim');
require('es6-shim');
//*/

jest.dontMock('../src/http.js');

//TODO, write tests
describe('Sever', function() {
	it('does something', function() {
		//ERROR, no tests because polyfill won't load correctly
	});
});	