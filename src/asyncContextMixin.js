/**
 * @flow
 */
var React = require('react');

/*------------------------------------------------------------------------------------------------*/
//	--- Async Context Mixin ---
/*------------------------------------------------------------------------------------------------*/
/**
 * A mixin to add to components that get their context from the render methods optional argument.
 */
type AsyncContextMixinType = { 
	childContextTypes: {async: Object}; 
	getChildContext: () => {async: Object};
	propTypes: {_context: Object};
};
var AsyncContextMixin: AsyncContextMixinType = {
	childContextTypes: {
		async: React.PropTypes.object.isRequired
	},
	getChildContext(): {app: any} {
		return { async: this.props._context };
	},
	propTypes: {
		_context: React.PropTypes.object.isRequired
	}
};

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports = AsyncContextMixin;