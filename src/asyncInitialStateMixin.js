/**
 * @flow
 */
var React = require('react');

/*------------------------------------------------------------------------------------------------*/
//	--- Async Initial State Mixin ---
/*------------------------------------------------------------------------------------------------*/
/**
 * A mixin to add to components that get their initial state using the static getAsyncInitialState
 * method.
 */
type AsyncInitialStateMixinType = { getInitialState: () => {[key: string]: any}; };
var AsyncInitialStateMixin: AsyncInitialStateMixinType = {
	getInitialState() {
		return this.props.initialState? this.props.initialState: {};
	}
};

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports = AsyncInitialStateMixin;