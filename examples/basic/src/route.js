var React = require('react');
var { RouteHandler, Link, Route, DefaultRoute } = require('react-router');
var { AsyncInitialStateMixin } = require('async-react-router');

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
		// INITIAL DATA, use local synchronous data
		getAsyncInitialState(props) {
			return props.dataSource? 
					props.dataSource.getData({from: 'ds1'}):
					{};
		}
	},
	mixins: [AsyncInitialStateMixin],
	render() {
		var state = this.state.PageOne;
		return (
			<div>
				<h4>Page One Header</h4>
				<article>
					{state && state.article? state && state.article: 'NO DATA'}
				</article>
			</div>
		);
	}
});

var PageTwo = React.createClass({
	statics: {
		// INITIAL DATA, use local asynchronous data
		getAsyncInitialState(props) {
			return props.dataSource? 
					props.dataSource.getDataAsync({from: 'ds2'}):
					Promise.resolve({});
		}
	},
	mixins: [AsyncInitialStateMixin],
	render() {
		var state = this.state.PageTwo;
		return (
			<div>
				<h4>Page Two Header</h4>
				<article>
					{state && state.article? state.article: 'NO DATA'}
				</article>
			</div>
		);
	}
});

var PageThree = React.createClass({
	statics: {
		// INITIAL DATA, use data from the server(asynchronously)
		getAsyncInitialState(props) {
			return props.lookup?
					props.lookup({from: 'ds3'}): 
					Promise.reject(new Error('No lookup function to use'));
		}
	},
	mixins: [AsyncInitialStateMixin],
	render() {
		var state = this.state.PageThree;
		return (
			<div>
				<h4>Page Three Header</h4>
				<article>
					<textarea 
						value={state && state.article? state.article: 'NO DATA'}
						ref="articleText"
						onChange={this.updateLocal}
					/>																		{/**/}
					<button onClick={this.updateServer}>Save</button>
				</article>
			</div>
		);
	},
	getArticleTextValue() {
		var node = React.findDOMNode(this.refs.articleText);
		return node.value;
	},
	updateLocal() {
		this.setState({article: this.getArticleTextValue()});
	},
	updateServer() {
		var payload = {
			actionType: 'a3',
			data: {article: this.getArticleTextValue()}
		};
		this.props.dispatch(payload)
			.then(() => this.props.lookup({from: 'ds3'}))
			.then((newState) => this.setState(newState));
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