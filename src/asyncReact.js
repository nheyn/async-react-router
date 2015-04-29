/**
 * @flow
 */
var React = require('react');

/*------------------------------------------------------------------------------------------------*/
//	Render functions
/*------------------------------------------------------------------------------------------------*/
/**
 * //TODO
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
 * //TODO
 */
function renderToString(element: ReactElement): Promise<string> {
	return getInitalState(element)
			.then((initialState) => {
				return React.renderToString(React.cloneElement(element, { initialState }));
			});
}

/**
 * //TODO
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