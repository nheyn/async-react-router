require("babel/polyfill");

var React = require('react');
var Router = require('react-router');
var route = require('./route.js').route;

// Render the page for the given route
window.onload = () => {
	AsyncRouter.run(route, Router.HistoryLocation, (Handler, state) => {
		AsyncReact.render(<Handler />, document.getElementById('react-element')).catch(
			(err) => { throw err }
		);
	});
};