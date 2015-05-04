require("babel/polyfill");

var React = require('react');
var Router = require('react-router');
var { route } = require('./route.js');
var { React: AsyncReact, Router: AsyncRouter } = require('async-react-router');
var DataSource = require('./dataSource.js');

var dataSource = new DataSource();

// Render the page for the given route
window.onload = () => {
	AsyncRouter.run(route, Router.HistoryLocation, (Handler, state) => {
		AsyncReact
			.render(
				<Handler dataSource={dataSource} />, 
				document.getElementById('react-element')
			)
			.catch(
				(err) => { throw err }
			);
	});
};