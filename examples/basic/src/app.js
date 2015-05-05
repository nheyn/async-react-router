require('babel/polyfill');

var React = require('react');
var Router = require('react-router');
var { route } = require('./route.js');
var { React: AsyncReact, Router: AsyncRouter } = require('async-react-router');
var DataSource = require('./dataSource.js');

// Sever connection
var send = (url, payload, errorMessage = 'Ajax Error') => {
	return new Promise((resolve, reject) => {
		var request = new XMLHttpRequest();
		request.onreadystatechange = () => {
			if(request.readyState !== 4) return;

			if(request.status === 200) {
				if(!request.responseText) {
					resolve({});
					return;
				}

				var responseJson = JSON.parse(request.responseText);
				if(responseJson.data)	resolve(responseJson.data);
				else					reject(new Error(errorMessage));
			} 
			else {
				reject(new Error(errorMessage));
			}
		};

		// Send Request
		request.open('POST', url, true);
		request.setRequestHeader('Content-Type', 'application/json');
		request.send(JSON.stringify(payload));
	});
};

// Data Lookup / Action Dispatcher
var lookup = (query) => send('/lookup', query, 'Error looking up data');
var dispatch = (payload) => send('/action', payload, 'Error performing action');

// Render the page for the given route
window.onload = () => {
	AsyncRouter.run(route, Router.HistoryLocation, (Handler, state) => {
		var componentPromise = AsyncReact.render(
			<Handler dataSource={new DataSource()} lookup={lookup} dispatch={dispatch} />,
			document.getElementById('react-element')
		);
		componentPromise
			.then(() => {/* If the component is needed */})
			.catch((err) => { throw err });
	});
};