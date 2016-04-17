/* global document */

import React from 'react';
import ReactDOM from 'react-dom';
import DecInc from '../index.jsx';

require('../style.styl');
require('./style.styl');

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			count: 33,
			gramm: 0.15
		};
		this.handleChangeCount = this.handleChangeCount.bind(this);
		this.handleChangeGramm = this.handleChangeGramm.bind(this);
	}

	handleChangeCount(value) {
		this.setState({count: value});
	}

	handleChangeGramm(value) {
		this.setState({gramm: value});
	}

	render() {
		return (
			<div
				style={{
					fontSize: '500%',
					fontFamily: 'monospace'
				}}
				>
				<div>
					<label>
						<small>{'Count: '}</small>
						<DecInc
							className="dec-inc_theme_example"
							value={this.state.count}
							max={33}
							min={0}
							onChange={this.handleChangeCount}
							/>
					</label>
				</div>
				<div>
					<label>
						<small>{'Gramm: '}</small>
						<DecInc
							className="dec-inc_theme_example"
							value={this.state.gramm}
							min={0}
							step={0.001}
							onChange={this.handleChangeGramm}
							/>
					</label>
				</div>
				<div>
					<label>
						<small>{'Round: '}</small>
						<DecInc
							className="dec-inc_theme_example"
							value={(Math.round(this.state.gramm * this.state.count))}
							disabled
							onChange={this.handleChangeGramm}
							/>
					</label>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<App/>, document.getElementById('app'));
