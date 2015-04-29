/**
 * @flow
 */
var React = require('react');
var Router = require('react-router');

/*------------------------------------------------------------------------------------------------*/
//	Run function
/*------------------------------------------------------------------------------------------------*/
function run(routes: any, location: any, callback: (Handler: any, state: any) => void) {
	Router.run(routes, location, (Handler, state) => {
		// Get all handlers with getAsyncInitialState method in the current route
		var asyncHandlers = state.routes
								.map(
									(route) => route.handler
								)
								.filter(
									(handler) => (handler && handler.getAsyncInitialState)
								);

		// Add getAsyncInitialState method to the to level handler
		Handler.getAsyncInitialState = (props) => {
			return Promise.all( asyncHandlers.map((def) => def.getAsyncInitialState(props)) )
					.then((resultsArray) => {
						var resultsObj = {};
						resultsArray.forEach((result, i) => {
							var key = asyncHandlers[i].displayName?
										asyncHandlers[i].displayName:
										i;
							resultsObj[key] = result;
						});
						return resultsObj;
					});
		};

		// Call callbacks, with updated Handler
		callback(Handler, state);
	});
}

/*------------------------------------------------------------------------------------------------*/
//	Exports
/*------------------------------------------------------------------------------------------------*/
module.exports.run = run;