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

		if (this.props.min !== undefined && value < this.props.min) {
			value = this.props.min;
		}

		if (this.props.max !== undefined && value > this.props.max) {
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
		} else if (e.key === 'End' && this.props.min !== undefined) {
			this.updateValue(this.props.min);
		} else if (e.key === 'Home' && this.props.max !== undefined) {
			this.updateValue(this.props.max);
		} else if (e.key === 'PageDown') {
			this.updateValue(this.props.value - 10);
		} else if (e.key === 'PageUp') {
			this.updateValue(this.props.value + 10);
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
				<DecIncControl
					type="dec"
					onClick={this.handleDec}
					isDisabled={!this.checkDecAvailable()}
					/>
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
				<DecIncControl
					type="inc"
					onClick={this.handleInc}
					isDisabled={!this.checkIncAvailable()}
					/>
			</div>
		);
	}
});

const DecIncControl = React.createClass({
	propTypes: {
		type: React.PropTypes.string.isRequired,
		onClick: React.PropTypes.func.isRequired,
		isDisabled: React.PropTypes.bool
	},

	getDefaultProps() {
		return {
			isDisabled: false
		};
	},

	handleClick() {
		if (this.props.isDisabled) {
			return;
		}

		this.props.onClick();
	},

	render() {
		const controlClassName = 'dec-inc__control';
		let className = `${controlClassName} ${controlClassName}_type_${this.props.type}`;
		if (this.props.isDisabled) {
			className += ` ${controlClassName}_disabled`;
		}

		return (
			<span
				className={className}
				onClick={this.handleClick}
				/>
		);
	}
});

export default DecInc;
