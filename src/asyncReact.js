/**
 * @flow
 */
var React = require('react');

/*------------------------------------------------------------------------------------------------*/
//	Render functions
/*------------------------------------------------------------------------------------------------*/
/**
 * Wrapper function for React.render, which allows that initial state of the component to be loaded
 * asynchronously.
 *
 * @param element	{ReactElement}				The React element to render
 * @param container	{DOM}						The DOM container to render the element in
 * 
 * @return			{Promise<ReactComponent>}	A promise that calls .then after the initial state
 *												is loaded and contains that value from React.render
 */
function render(element: ReactElement, container: any): Promise<ReactComponent> {
	return getInitialState(element)
			.then(
				(initialState) => React.cloneElement(element, { initialState })
			)
			.catch(
				() => element // Render default element if there is any errors
			)
			.then(
				(elemt) => React.render(elemt, container)
			);
}

/**
 * Wrapper function for React.renderToString, which allows that initial state of the component to be
 * loaded asynchronously.
 *
 * @param element	{ReactElement}		The React element to render
 *
 * @return			{Promise<string>}	A promise that calls .then after the initial state is loaded
 *										and contains that value from string React.renderToString
 */
function renderToString(element: ReactElement): Promise<string> {
	return getInitialState(element)
			.then((initialState) => {
				return React.renderToString(React.cloneElement(element, { initialState }));
			});
}

/**
 * Wrapper function for React.renderToString, which allows that initial state of the component to be
 * loaded asynchronously.
 *
 * @param element	{ReactElement}		The React element to render
 *
 * @return			{Promise<string>}	A promise that calls .then after the initial state is loaded
 *										and contains that value from string 
 *										React.renderToStaticMarkup
 */
function renderToStaticMarkup(element: ReactElement): Promise<string> {
	return getInitialState(element)
			.then((initialState) => {
				return React.renderToStaticMarkup(React.cloneElement(element, { initialState }));
			});
}

/*------------------------------------------------------------------------------------------------*/
//	Helper functions
/*------------------------------------------------------------------------------------------------*/
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
//	Exports
/*------------------------------------------------------------------------------------------------*/
module.exports.render = render;
module.exports.renderToString = renderToString;
module.exports.renderToStaticMarkup = renderToStaticMarkup;