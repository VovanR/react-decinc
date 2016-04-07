import React from 'react';

const DecInc = React.createClass({
	propTypes: {
		value: React.PropTypes.number,
		min: React.PropTypes.number,
		max: React.PropTypes.number,
		onChange: React.PropTypes.func
	},

	handleChange(e) {
		this.updateValue(e.target.value);
	},

	handleDec() {
		let value = this.props.value - 1;

		if (value < this.props.min) {
			value = this.props.min;
		}

		this.updateValue(value);
	},

	handleInc() {
		let value = this.props.value + 1;

		if (value > this.props.max) {
			value = this.props.max;
		}

		this.updateValue(value);
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

	render() {
		return (
			<div className="dec-inc">
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
