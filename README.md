#Async React Router
*Async wrapper functions for react and react router*

###Wrapper Functions
* Wrapper for React.render/.renderToString/.renderToStaticMarkup that allow Async Initial Data
* Wrapper for ReactRouter.run that allow Async Initial Data, when using React wrapper functions (see above)

###Usage
Add the static function, *getAsyncInitialState(props)*, and one of the mixins, **AsyncInitialStateMixin** or **AsyncInitialStateHandlerMixin**, to a react class.
This function will be passed the initial props and should return a promise that contains the initial state.

Using the wrapper function (see bellow) and one of the mixins, will set the state of the component before it is rendered.
Only works on the root component passed to the render function, unless using *AsyncReactRouter.run()*.
It will call *getAsyncInitialState(props)* for each of the Handlers in the current route when one of the *AsyncReact* render functions is called.
Must use the **AsyncInitialStateHandlerMixin** for this to work.
This mixin also adds the *getSubRouteHandler(props = {})* method, which should be used instead of *&lt;RouteHandler /&gt;* to render any Route Handler Component that also uses **AsyncInitialStateHandlerMixin**.

The **AsyncReact** render functions can also be passed an extra argument (not in the **React** render functions) that takes an object, that will be put in *this.context.async*.
The component given to the *AsyncReact* render functions, or the root route Handler if using *AsyncReactRouter.run()*, must use **AsyncContextHandlerMixin** for this to work.

Any unhanded error will be in the promise returned by one of the wrapper functions.

###Example
See /examples/basic/ for a simple example web site that uses AsyncReactRouter.http.createServer

###Tests
FIXED: Issue using polyfill with jest (https://github.com/babel/babel-jest/issues/20)
TODO: Write the tests

###Documentation
TODO: Get documentation from code

###Plans
* Write tests
* Get documentation from code
* Generate app.js (see /examples/basic/src/app.js) in *createServer()* function
* Get ES6 modules working (see es6-modules branch)
