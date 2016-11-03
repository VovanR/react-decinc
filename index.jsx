/* eslint react/forbid-component-props: 0 */

import React from 'react';

const DecInc = React.createClass({
	propTypes: {
		value: React.PropTypes.number,
		min: React.PropTypes.number,
		max: React.PropTypes.number,
		step: React.PropTypes.number,
		disabled: React.PropTypes.bool,
		className: React.PropTypes.string,
		onChange: React.PropTypes.func
	},

	getDefaultProps() {
		return {
			step: 1,
			disabled: false
		};
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
		if (this.props.disabled || !this.props.onChange) {
			return;
		}

		value = parseFloat(value);

		if (isNaN(value)) {
			return;
		}

		if (this.props.min !== undefined && value < this.props.min) {
			value = this.props.min;
		}

		if (this.props.max !== undefined && value > this.props.max) {
			value = this.props.max;
		}

		value = parseFloat(this.toFixed(value));

		this.props.onChange(value);
	},

	toFixed(value) {
		const old = this.getPrecision(this.props.value);
		const step = this.getPrecision(this.props.step);

		if (!old && !step) {
			return value;
		}

		return value.toFixed(Math.max(old, step));
	},

	getPrecision(value) {
		const v = String(value);
		if (!/\./.test(v)) {
			return 0;
		}
		return v.split('.')[1].length;
	},

	checkDecAvailable() {
		if (this.props.disabled) {
			return false;
		}

		if (!Number.isInteger(this.props.min)) {
			return true;
		}

		return this.props.value > this.props.min;
	},

	checkIncAvailable() {
		if (this.props.disabled) {
			return false;
		}

		if (!Number.isInteger(this.props.max)) {
			return true;
		}

		return this.props.value < this.props.max;
	},

	handleKeyDown(e) {
		if (e.key === 'ArrowDown') {
			this.dec();
		} else if (e.key === 'ArrowUp') {
			this.inc();
		} else if (e.key === 'End' && this.props.min !== undefined) {
			this.updateValue(this.props.min);
		} else if (e.key === 'Home' && this.props.max !== undefined) {
			this.updateValue(this.props.max);
		} else if (e.key === 'PageDown') {
			this.updateValue(this.props.value - (this.props.step * 10));
		} else if (e.key === 'PageUp') {
			this.updateValue(this.props.value + (this.props.step * 10));
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
		let value = this.props.value - this.props.step;

		if (value < this.props.min) {
			value = this.props.min;
		}

		this.updateValue(value);
	},

	inc() {
		let value = this.props.value + this.props.step;

		if (value > this.props.max) {
			value = this.props.max;
		}

		this.updateValue(value);
	},

	render() {
		let className = 'dec-inc';
		if (this.props.disabled) {
			className += ` ${className}_disabled`;
		}
		if (this.props.className) {
			className += ' ';
			className += this.props.className;
		}

		return (
			<div className={className}>
				<DecIncControl
					type="dec"
					onClick={this.handleDec}
					disabled={!this.checkDecAvailable()}
					/>
				<input
					className="dec-inc__value"
					type="text"
					value={this.toFixed(this.props.value)}
					disabled={this.props.disabled}
					onChange={this.handleChange}
					onKeyDown={this.handleKeyDown}
					onWheel={this.handleWheel}
					onFocus={this.handleFocus}
					onBlur={this.handleBlur}
					/>
				<DecIncControl
					type="inc"
					onClick={this.handleInc}
					disabled={!this.checkIncAvailable()}
					/>
			</div>
		);
	}
});

const DecIncControl = React.createClass({
	propTypes: {
		type: React.PropTypes.string.isRequired,
		onClick: React.PropTypes.func.isRequired,
		disabled: React.PropTypes.bool
	},

	getDefaultProps() {
		return {
			disabled: false
		};
	},

	waitTimer: null,
	waitInterval: 500,
	repeatTimer: null,
	repeatInterval: 40,

	isPressed: false,
	// Flag for prevent trailing mouseUp handler when repeatTimer fired > 0 times
	isProcessed: false,
	// Flag for canceling from mouseDown to mouseOut interval < waitInterval
	isCanceled: false,

	handleClick() {
		if (this.props.disabled) {
			this.stopTimers();
			return;
		}

		this.isProcessed = true;
		this.props.onClick();
	},

	handleMouseDown() {
		if (this.props.disabled) {
			return;
		}

		this.isPressed = true;
		this.waitTimer = setTimeout(this.holdPress, this.waitInterval);
	},

	handleMouseUp() {
		if (!this.isPressed) {
			return;
		}

		this.releasePress();
	},

	handleMouseOut() {
		if (!this.isPressed) {
			return;
		}

		this.isCanceled = true;
		this.releasePress();
	},

	holdPress() {
		this.stopTimers();
		this.repeatTimer = setInterval(this.handleClick, this.repeatInterval);
	},

	releasePress() {
		this.stopTimers();
		if (!this.isProcessed && !this.isCanceled) {
			this.handleClick();
		}

		this.isPressed = false;
		this.isProcessed = false;
		this.isCanceled = false;
	},

	stopTimers() {
		clearTimeout(this.waitTimer);
		clearInterval(this.repeatTimer);
	},

	render() {
		const controlClassName = 'dec-inc__control';
		let className = `${controlClassName} ${controlClassName}_type_${this.props.type}`;
		if (this.props.disabled) {
			className += ` ${controlClassName}_disabled`;
		}

		return (
			<span
				className={className}
				onMouseDown={this.handleMouseDown}
				onMouseUp={this.handleMouseUp}
				onMouseOut={this.handleMouseOut}
				/>
		);
	}
});

export default DecInc;
