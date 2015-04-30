require("babel/polyfill");

var path = require('path');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

// Handlers
var Page = React.createClass({
	render() {
		return (
			<div>
				<h2>Site Heading</h2>
				<nav>
					<ul>
						<li><Link to="p1">P1</Link></li>
						<li><Link to="p2">P2</Link></li>
						<li><Link to="p3">P3</Link></li>
					</ul>
				</nav>
				<RouteHandler />
			</div>
		);
	}
});

var PageOne = React.createClass({
	render() {
		return (
			<div>
				<h4>Page One Header</h4>
				<article>
					Page one content...
				</article>
			</div>
		);
	}
});

var PageTwo = React.createClass({
	render() {
		return (
			<div>
				<h4>Page Two Header</h4>
				<article>
					Page two content...
				</article>
			</div>
		);
	}
});

var PageThree = React.createClass({
	render() {
		return (
			<div>
				<h4>Page Three Header</h4>
				<article>
					Page three content...
				</article>
			</div>
		);
	}
});

// Start server
var reactHttp = require('async-react-router').http;

reactHttp.createServer({
	route: (
			<Route path="/" handler={Page}>
				<DefaultRoute name="p1" handler={PageOne} />
				<Route name="p2" handler={PageTwo} />
				<Route name="p3" handler={PageThree} />
			</Route>
	),
	staticFileDirectory: path.join(__dirname, 'statics/'),
	htmlTemplate: path.join(__dirname, 'template.html')
}).listen(8080);