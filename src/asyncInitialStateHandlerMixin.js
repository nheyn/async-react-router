/**
 * @flow
 */
var React = require('react');
var { RouteHandler } = require('react-router');

/*------------------------------------------------------------------------------------------------*/
//	--- Async Initial State Mixin ---
/*------------------------------------------------------------------------------------------------*/
/**
 * A mixin to add to components that get their initial state using the static getAsyncInitialState
 * method.
 */
type AsyncInitialStateHandlerMixinType = { 
	getInitialState: () => {[key: string]: any}; 
	getSubRouteHandler: (props?: {[key: string]: any}) => ReactElement;
};
var AsyncInitialStateHandlerMixin: AsyncInitialStateHandlerMixinType = {
	getInitialState(): {[key: string]: any} {
		var displayName = this.constructor.displayName;
		if(!this.props._initialState || !this.props._initialState[displayName]) return {};

		return this.props._initialState[displayName];
	},
	getSubRouteHandler(props: {[key: string]: any} = {}): ReactElement {
		var handlerProps = {};
		for(var key in props) handlerProps[key] = props[key];
		if(this.props._initialState) handlerProps._initialState = this.props._initialState;
		if(this.props._error) handlerProps._error = this.props._error;

		return <RouteHandler {...handlerProps} />;
	}
};

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports = AsyncInitialStateHandlerMixin;