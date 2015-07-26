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
		var getHandler = (route) => route.handler;
		var hasAsyncInitialState = (handler) => handler&&handler.getAsyncInitialState? true: false;

		var initalStateHandlers = state.routes.map(getHandler).filter(hasAsyncInitialState);

		// Add getAsyncInitialState method to the to level handler
		Handler.getAsyncInitialState = (props) => {
			var initialStatePromises = initalStateHandlers.map((handler, i) => {
				return handler.getAsyncInitialState(props);
			});

			return Promise.all(initialStatePromises).then((initialStateArray) => {
				var initialStateObj = {};
				for(var i=0; i<initialStateArray.length; i++) {
					if(!initalStateHandlers[i].displayName) {
						throw new Error(
							'All React Router handler components that use getAsyncInitialState ' +
							'must have a displayName'
						);
					}

					var displayName = initalStateHandlers[i].displayName;
					var initialState = initialStateArray[i];

					initialStateObj[displayName] = initialState;
				}
				return initialStateObj;
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
