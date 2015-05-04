var React = require('react');
var  { RouteHandler, Link, Route, DefaultRoute } = require('react-router');

// Test Site's Handlers
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
				<RouteHandler {... this.props} />
			</div>
		);
	}
});

var PageOne = React.createClass({
	statics: {
		getAsyncInitialState(props) {
			return props.dataSource? 
					props.dataSource.getData({from: 'ds1'}):
					{};
		}
	},
	getInitialState() {
		return this.props.initialState && this.props.initialState.PageOne?
				this.props.initialState.PageOne:
				{};
	},
	render() {
		return (
			<div>
				<h4>Page One Header</h4>
				<article>
					{this.state.article? this.state.article: 'NO DATA'}
				</article>
			</div>
		);
	}
});

var PageTwo = React.createClass({
	statics: {
		getAsyncInitialState(props) {
			return props.dataSource? 
					props.dataSource.getDataAsync({from: 'ds2'}):
					Promise.resolve({});
		}
	},
	getInitialState() {
		return this.props.initialState && this.props.initialState.PageTwo?
				this.props.initialState.PageTwo:
				{};
	},
	render() {
		return (
			<div>
				<h4>Page Two Header</h4>
				<article>
					{this.state.article? this.state.article: 'NO DATA'}
				</article>
			</div>
		);
	}
});

var PageThree = React.createClass({
	statics: {
		getAsyncInitialState(props) {
			return props.dataSource? 
					props.dataSource.getDataAsync({from: 'ds3'}):
					Promise.resolve({});
		}
	},
	getInitialState() {
		return this.props.initialState && this.props.initialState.PageThree?
				this.props.initialState.PageThree:
				{};
	},
	render() {
		return (
			<div>
				<h4>Page Three Header</h4>
				<article>
					{this.state.article? this.state.article: 'NO DATA'}
				</article>
			</div>
		);
	}
});

// Routes
var route = (
	<Route path="/" handler={Page}>
		<DefaultRoute name="p1" handler={PageOne} />
		<Route name="p2" handler={PageTwo} />
		<Route name="p3" handler={PageThree} />
	</Route>
);

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports.route = route;