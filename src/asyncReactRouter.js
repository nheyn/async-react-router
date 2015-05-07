/**
 * @flow
 */
var React = require('react');
var Router = require('react-router');

/*------------------------------------------------------------------------------------------------*/
//	--- Run function ---
/*------------------------------------------------------------------------------------------------*/
/**
 * Wrapper function for Router.run, which allows that initial state of the component to be loaded
 * asynchronously.
 *
 * @param route		{ReactRouterRoute}					The Route to render for
 * @param location	{string | Router.HistoryLocation}	The uri, or how to get the uri
 * @param callback	{ReactRouterCallback}				The the callback that should should contain
 *														the code to render the current handler
 */
function run(route: ReactRouterRoute, location: any, callback: ReactRouterCallback) {
	Router.run(route, location, (Handler, state) => {
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
			return Promise.all( asyncHandlers.map((handler) => handler.getAsyncInitialState(props)))
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
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports.run = run;