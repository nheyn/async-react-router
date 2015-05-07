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
type AsyncInitialStateMixinType = {
	getInitalState: () => {[key: string]: any};
};
var AsyncInitialStateMixin: AsyncInitialStateMixinType = {
	getInitalState() {
		return this.props.initialState? this.props.initialState: {};
	}
};

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports = AsyncInitialStateMixin;