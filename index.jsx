import React from 'react';

const DecInc = React.createClass({
	propTypes: {
		value: React.PropTypes.number,
		min: React.PropTypes.number,
		max: React.PropTypes.number,
		onChange: React.PropTypes.func,
		className: React.PropTypes.string
	},

	getInitialState() {
		return {isFocused: false};
	},

	handleChange(e) {
		this.updateValue(e.target.value);
	},

	handleDec() {
		this.dec();
	},

	handleInc() {
		this.inc();
	},

	updateValue(value) {
		value = parseInt(value, 10);

		if (isNaN(value)) {
			return;
		}

		if (Number.isInteger(this.props.min) && value < this.props.min) {
			value = this.props.min;
		}

		if (Number.isInteger(this.props.max) && value > this.props.max) {
			value = this.props.max;
		}

		this.props.onChange(value);
	},

	checkDecAvailable() {
		if (!Number.isInteger(this.props.min)) {
			return true;
		}

		return this.props.value > this.props.min;
	},

	checkIncAvailable() {
		if (!Number.isInteger(this.props.max)) {
			return true;
		}

		return this.props.value < this.props.max;
	},

	handleKeyUp(e) {
		if (e.key === 'ArrowDown') {
			this.dec();
		} else if (e.key === 'ArrowUp') {
			this.inc();
		}
	},

	handleWheel(e) {
		if (!this.state.isFocused) {
			return;
		}

		e.preventDefault();

		if (e.deltaY > 0) {
			this.dec();
		} else {
			this.inc();
		}
	},

	handleFocus() {
		this.setState({isFocused: true});
	},

	handleBlur() {
		this.setState({isFocused: false});
	},

	dec() {
		let value = this.props.value - 1;

		if (value < this.props.min) {
			value = this.props.min;
		}

		this.updateValue(value);
	},

	inc() {
		let value = this.props.value + 1;

		if (value > this.props.max) {
			value = this.props.max;
		}

		this.updateValue(value);
	},

	render() {
		let className = 'dec-inc';
		if (this.props.className) {
			className += ' ';
			className += this.props.className;
		}

		return (
			<div className={className}>
				{this.checkDecAvailable() ? (
					<span
						className="dec-inc__dec"
						onClick={this.handleDec}
						/>
				) : false}
				<input
					className="dec-inc__value"
					type="text"
					value={this.props.value}
					onChange={this.handleChange}
					onKeyUp={this.handleKeyUp}
					onWheel={this.handleWheel}
					onFocus={this.handleFocus}
					onBlur={this.handleBlur}
					/>
				{this.checkIncAvailable() ? (
					<span
						className="dec-inc__inc"
						onClick={this.handleInc}
						/>
				) : false}
			</div>
		);
	}
});

export default DecInc;
