require('babel/polyfill');

var React = require('react');
var Router = require('react-router');
var { route } = require('./route.js');
var { React: AsyncReact, Router: AsyncRouter } = require('async-react-router');
var DataSource = require('./dataSource.js');

var dataSource = new DataSource();
var lookup = (query) => {
	return new Promise((resolve, reject) => {
		var request = new XMLHttpRequest();
		request.onreadystatechange = () => {
			if(request.readyState !== 4) return;

			if(request.status === 200) {
				var responseJson = JSON.parse(request.responseText);
				if(responseJson.data)	resolve(responseJson.data);
				else					reject(new Error('Error lookup data'));
			} 
			else {
				reject(new Error('Error lookup data'));
			}
		};

		// Send Request
		request.open('POST', '/lookup', true);
		request.setRequestHeader('Content-Type', 'application/json');
		request.send(JSON.stringify(query));
	});
};

// Render the page for the given route
window.onload = () => {
	AsyncRouter.run(route, Router.HistoryLocation, (Handler, state) => {
		var componentPromise = AsyncReact.render(
			<Handler dataSource={dataSource} lookup={lookup} />, 
			document.getElementById('react-element')
		);
		componentPromise
			.then(() => {/* If the component is needed */})
			.catch((err) => { throw err });
	});
};