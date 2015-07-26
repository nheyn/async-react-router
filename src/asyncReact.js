/**
 * @flow
 */
var React = require('react');

/*------------------------------------------------------------------------------------------------*/
//	--- Render functions ---
/*------------------------------------------------------------------------------------------------*/
/**
 * Wrapper function for React.render, which allows that initial state of the component to be loaded
 * asynchronously.
 *
 * @param element	{ReactElement}				The React element to render
 * @param container	{DOM}						The DOM container to render the element in
 * @param context	{MaybePromise}				A promise that contains the context for elements
 *												being rendered
 *
 * @return			{Promise<ReactComponent>}	A promise that contains the component returned from
 *												React.render
 */
function render(element: ReactElement, container: any, context: ?MaybePromise)
																		: Promise<ReactComponent> {
	var contextPromise = Promise.resolve(context);
	return getElementWithContextAndInitialState(element, contextPromise, getInitialState(element))
			.then((elemt) => React.render(elemt, container));
}

/**
 * Wrapper function for React.renderToString, which allows that initial state of the component to be
 * loaded asynchronously.
 *
 * @param element	{ReactElement}		The React element to render
 * @param context	{MaybePromise}		A promise that contains the context for elements
 *										being rendered
 *
 * @return			{Promise<string>}	A promise that calls .then after the initial state is loaded
 *										and contains that value from string React.renderToString
 */
function renderToString(element: ReactElement, context: ?MaybePromise): Promise<string> {
	var contextPromise = Promise.resolve(context);
	return getElementWithContextAndInitialState(element, contextPromise, getInitialState(element))
			.then((elemt) => React.renderToString(elemt));
}

/**
 * Wrapper function for React.renderToString, which allows that initial state of the component to be
 * loaded asynchronously.
 *
 * @param element	{ReactElement}		The React element to render
 * @param context	{MaybePromise}		A promise that contains the context for elements
 *										being rendered
 *
 * @return			{Promise<string>}	A promise that calls .then after the initial state is loaded
 *										and contains that value from string
 *										React.renderToStaticMarkup
 */
function renderToStaticMarkup(element: ReactElement, context: ?MaybePromise): Promise<string> {
	var contextPromise = Promise.resolve(context);
	return getElementWithContextAndInitialState(element, contextPromise, getInitialState(element))
			.then((elemt) => React.renderToStaticMarkup(elemt));
}

/*------------------------------------------------------------------------------------------------*/
//	--- Helper functions ---
/*------------------------------------------------------------------------------------------------*/
function getElementWithContextAndInitialState(	element				: ReactElement,
												contextPromise		: Promise,
												initialStatePromise	: Promise		)
																	: Promise<ReactElement>	{
	return Promise.all([contextPromise, initialStatePromise]).then((results) =>	{
		return React.cloneElement(element, { _context: results[0], _initialState: results[1] });
	});
}

function getInitialState(element: ReactElement): Promise {
	if(!element.type.getAsyncInitialState) return Promise.reject(new Error('No Initial State'));

	var asyncInitialState = element.type.getAsyncInitialState(element.props);
	return Promise.resolve(asyncInitialState).then((initialState) => {
		// Get parts of state that are promise
		var promiseKeys: Array<string> = [];
		var promiseValues: Array<Promise> = [];
		var resolvedInitialState: {[key: string]: any} = {};
		for(var key in initialState) {
			var value = initialState[key];
			if(typeof value === 'Promise') {	// If value is promises
				promiseKeys.push(key);
				promiseValues.push(value);
			}
			else {
				resolvedInitialState[key] = value;
			}
		}

		// Resolve promiseValues and add to result
		return Promise.all(promiseValues).then((resolvedValues) => {
			for(var i=0; i<resolvedValues.length; i++) {
				resolvedInitialState[promiseKeys[i]] = resolvedValues[i];
			}
			return resolvedInitialState;
		});
	});
}

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports.render = render;
module.exports.renderToString = renderToString;
module.exports.renderToStaticMarkup = renderToStaticMarkup;
