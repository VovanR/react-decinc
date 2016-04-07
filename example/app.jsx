/* global document */

import React from 'react';
import ReactDOM from 'react-dom';
import DecInc from '../index.jsx';

require('../style.styl');

class App extends React.Component {
	constructor() {
		super();
		this.state = {value: 0};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(value) {
		this.setState({value: value});
	}

	render() {
		return (
			<div>
				<small>{'Items: '}</small>
				<DecInc
					value={this.state.value}
					max={10}
					min={0}
					onChange={this.handleChange}
					/>
			</div>
		);
	}
}

ReactDOM.render(<App/>, document.getElementById('app'));
