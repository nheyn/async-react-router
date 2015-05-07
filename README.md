#Async React Router
*Async wrapper functions for react and react router*

###Usage
Add the static function, *getAsyncInitialState(props)*, to a react class. 
This function will be passed the initial props and should return a promise that contains an object or an object that (may)contains Promises as it values. 
Using the wrapper function (see bellow) will add the prop *initalState* with the result when the promises are fulfilled. 
Any unhanded error will be in the promise returned by one of the wrapper functions.

###Wrapper Functions
* Wrapper for React.render/.renderToString/.renderToStaticMarkup that allow Async Initial Data 
* Wrapper for ReactRouter.run that allow Async Initial Data, when using React wrapper functions (see above)
* Wrapper for http.createServer that creates a server for an isomorphic web apps (includes server side rendering for initial page load).

###Example
See /examples/basic/ for a simple example web site that uses .createServer

###Tests
TODO: Issue using polyfill with jest (https://github.com/babel/babel-jest/issues/20)

###Documentation
TODO: Get documentation from code

###Plans
* Fix issue using polyfill with jest and create tests
* Get documentation from code
* Send correct MIME type for static files
* Add support for /favicon.ico
* Create mixin for React Router handler components (that use async initial state)
* Generate app.js (see /examples/basic/src/app.js) in *createServer()* function
* Get ES6 modules working (see es6-modules branch)

