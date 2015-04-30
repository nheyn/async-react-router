var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var reactHttp = require('async-flux-router').reactHttp;

reactHttp.createServer({
	route: (
		<Route handler={Page}>
			<DefaultRoute name="p1" handler={PageOne} />
			<Route name="p2" handler={PageTwo} />
			<Route name="p3" handler={PageThree} />
		</Route>
	),
	staticFileDirectory: './statics/',
	htmlTemplate: './template.html'
}).listen(8080);

// Handlers
var Page = React.createClass({
	render: {
		return (
			<div>
				<h2>Site Heading</h2>
				<RouteHandler />
			</div>
		);
	}
});

var PageOne = React.createClass({
	render: {
		return (
			<div>
				<h4>Page One Header/h4>
				<article>
					Page one content...
				</article>
			</div>
		);
	}
});

var PageTwo = React.createClass({
	render: {
		return (
			<div>
				<h4>Page Two Header/h4>
				<article>
					Page two content...
				</article>
			</div>
		);
	}
});

var PageThree = React.createClass({
	render: {
		return (
			<div>
				<h4>Page Three Header/h4>
				<article>
					Page three content...
				</article>
			</div>
		);
	}
});