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
	return getInitalState(element)
			.then(
				(initialState) => React.cloneElement(element, { initialState: initialState })
			)
			.catch(
				() => element // Render given element if there is any errors
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
	return getInitalState(element)
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
	return getInitalState(element)
			.then((initialState) => {
				return React.renderToStaticMarkup(React.cloneElement(element, { initialState }));
			});
}

/*------------------------------------------------------------------------------------------------*/
//	Helper functions
/*------------------------------------------------------------------------------------------------*/
function getInitalState(element: ReactElement): Promise {
	return element.type.getAsyncInitialState?
			element.type.getAsyncInitialState(element.props):
			Promise.reject(new Error('No Initial State'));
}

/*------------------------------------------------------------------------------------------------*/
//	Exports
/*------------------------------------------------------------------------------------------------*/
module.exports.render = render;
module.exports.renderToString = renderToString;
module.exports.renderToStaticMarkup = renderToStaticMarkup;