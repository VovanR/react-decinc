import test from 'ava';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import jsdom from 'jsdom';
import C from './';

test.beforeEach(() => {
	global.document = jsdom.jsdom();
	global.window = global.document.defaultView;
});

test.afterEach(() => {
	delete global.document;
	delete global.window;
});

test(t => {
	const result = createComponent(C);

	t.is(result.props.className, 'dec-inc');
	t.is(result.type, 'div');
});

test('render childrens', t => {
	const props = {
		value: 5,
		min: 2,
		max: 9
	};
	const result = renderIntoDocument(props);

	const dec = getDec(result);
	t.is(dec.nodeName, 'SPAN');
	t.is(dec.className, 'dec-inc__control dec-inc__control_type_dec');

	const value = getValue(result);
	t.is(value.nodeName, 'INPUT');
	t.is(value.className, 'dec-inc__value');

	const inc = getInc(result);
	t.is(inc.nodeName, 'SPAN');
	t.is(inc.className, 'dec-inc__control dec-inc__control_type_inc');
});

test('disable dec if value is min', t => {
	const props = {
		value: 5,
		min: 5
	};
	const result = renderIntoDocument(props);

	const dec = getDec(result);
	t.regex(dec.className, /dec-inc__control_disabled/);
});

test('disable inc if value is max', t => {
	const props = {
		value: 5,
		max: 5
	};
	const result = renderIntoDocument(props);

	const inc = getInc(result);
	t.regex(inc.className, /dec-inc__control_disabled/);
});

test('allow to add custom class name', t => {
	const props = {
		className: 'foo bar'
	};
	const result = createComponent(C, props);

	t.is(result.props.className, 'dec-inc foo bar');
});

test('dec Click', t => {
	let count = 5;
	const props = {
		value: count,
		onChange(value) {
			count = value;
		}
	};
	const result = renderIntoDocument(props);
	const dec = getDec(result);

	ReactTestUtils.Simulate.mouseDown(dec);
	ReactTestUtils.Simulate.mouseUp(dec);
	t.is(count, 4);
});

test('inc Click', t => {
	let count = 5;
	const props = {
		value: count,
		onChange(value) {
			count = value;
		}
	};
	const result = renderIntoDocument(props);
	const inc = getInc(result);

	ReactTestUtils.Simulate.mouseDown(inc);
	ReactTestUtils.Simulate.mouseUp(inc);
	t.is(count, 6);
});

test('value ArrowDown', t => {
	let count = 5;
	const props = {
		value: count,
		onChange(value) {
			count = value;
		}
	};
	const result = renderIntoDocument(props);
	const value = getValue(result);

	ReactTestUtils.Simulate.keyDown(value, {key: 'ArrowDown'});
	t.is(count, 4);
});

test('value ArrowUp', t => {
	let count = 5;
	const props = {
		value: count,
		onChange(value) {
			count = value;
		}
	};
	const result = renderIntoDocument(props);
	const value = getValue(result);

	ReactTestUtils.Simulate.keyDown(value, {key: 'ArrowUp'});
	t.is(count, 6);
});

test('value PageDown', t => {
	let count = 55;
	const props = {
		value: count,
		onChange(value) {
			count = value;
		}
	};
	const result = renderIntoDocument(props);
	const value = getValue(result);

	ReactTestUtils.Simulate.keyDown(value, {key: 'PageDown'});
	t.is(count, 45);
});

test('value PageUp', t => {
	let count = 55;
	const props = {
		value: count,
		onChange(value) {
			count = value;
		}
	};
	const result = renderIntoDocument(props);
	const value = getValue(result);

	ReactTestUtils.Simulate.keyDown(value, {key: 'PageUp'});
	t.is(count, 65);
});

test('value End', t => {
	let count = 5;
	const props = {
		value: count,
		min: -3,
		onChange(value) {
			count = value;
		}
	};
	const result = renderIntoDocument(props);
	const value = getValue(result);

	ReactTestUtils.Simulate.keyDown(value, {key: 'End'});
	t.is(count, -3);
});

test('value Home', t => {
	let count = 5;
	const props = {
		value: count,
		max: 33,
		onChange(value) {
			count = value;
		}
	};
	const result = renderIntoDocument(props);
	const value = getValue(result);

	ReactTestUtils.Simulate.keyDown(value, {key: 'Home'});
	t.is(count, 33);
});

test('value End without min', t => {
	let count = 5;
	const props = {
		value: count,
		onChange(value) {
			count = value;
		}
	};
	const result = renderIntoDocument(props);
	const value = getValue(result);

	ReactTestUtils.Simulate.keyDown(value, {key: 'End'});
	t.is(count, 5);
});

test('value Home without max', t => {
	let count = 5;
	const props = {
		value: count,
		onChange(value) {
			count = value;
		}
	};
	const result = renderIntoDocument(props);
	const value = getValue(result);

	ReactTestUtils.Simulate.keyDown(value, {key: 'Home'});
	t.is(count, 5);
});

test('value Change', t => {
	let count = 5;
	const props = {
		value: count,
		onChange(value) {
			count = value;
		}
	};
	const result = renderIntoDocument(props);
	const value = getValue(result);

	value.value = '3';
	ReactTestUtils.Simulate.change(value);
	t.is(count, 3);

	value.value = 'foo';
	ReactTestUtils.Simulate.change(value);
	t.is(count, 3, 'only Number');
});

test('value Wheel down', t => {
	let count = 5;
	const props = {
		value: count,
		onChange(value) {
			count = value;
		}
	};
	const result = renderIntoDocument(props);
	const value = getValue(result);

	let isDefaultPrevented = false;
	const eventProps = {
		deltaY: 5,
		preventDefault() {
			isDefaultPrevented = true;
		}
	};

	ReactTestUtils.Simulate.wheel(value, eventProps);
	t.is(count, 5, 'without focus');
	t.false(isDefaultPrevented, 'without focus');
	isDefaultPrevented = false;

	ReactTestUtils.Simulate.focus(value);
	ReactTestUtils.Simulate.wheel(value, eventProps);
	t.is(count, 4);
	t.true(isDefaultPrevented, 'prevent page scroll');
	isDefaultPrevented = false;

	ReactTestUtils.Simulate.blur(value);
	ReactTestUtils.Simulate.wheel(value, eventProps);
	t.is(count, 4, 'without focus');
	t.false(isDefaultPrevented, 'without focus');
});

test('value Wheel up', t => {
	let count = 5;
	const props = {
		value: count,
		onChange(value) {
			count = value;
		}
	};
	const result = renderIntoDocument(props);
	const value = getValue(result);

	let isDefaultPrevented = false;
	const eventProps = {
		deltaY: -5,
		preventDefault() {
			isDefaultPrevented = true;
		}
	};

	ReactTestUtils.Simulate.wheel(value, eventProps);
	t.is(count, 5, 'without focus');
	t.false(isDefaultPrevented, 'without focus');
	isDefaultPrevented = false;

	ReactTestUtils.Simulate.focus(value);
	ReactTestUtils.Simulate.wheel(value, eventProps);
	t.is(count, 6);
	t.true(isDefaultPrevented, 'prevent page scroll');
	isDefaultPrevented = false;

	ReactTestUtils.Simulate.blur(value);
	ReactTestUtils.Simulate.wheel(value, eventProps);
	t.is(count, 6, 'without focus');
	t.false(isDefaultPrevented, 'without focus');
});

test('dec with step', t => {
	let count = 0.3;
	const props = {
		value: count,
		step: 0.1,
		onChange(value) {
			count = value;
		}
	};
	const result = renderIntoDocument(props);
	const dec = getDec(result);

	ReactTestUtils.Simulate.mouseDown(dec);
	ReactTestUtils.Simulate.mouseUp(dec);
	t.is(count, 0.2);
});

test('inc with step', t => {
	let count = 0.2;
	const props = {
		value: count,
		step: 0.1,
		onChange(value) {
			count = value;
		}
	};
	const result = renderIntoDocument(props);
	const inc = getInc(result);

	ReactTestUtils.Simulate.mouseDown(inc);
	ReactTestUtils.Simulate.mouseUp(inc);
	t.is(count, 0.3);
});

test('value Change with step precision', t => {
	let count = 1;
	const props = {
		value: count,
		step: 0.01,
		onChange(value) {
			count = value;
		}
	};
	const result = renderIntoDocument(props);
	const value = getValue(result);

	t.is(value.value, '1.00');
});

test('value PageDown with step', t => {
	let count = 0.31;
	const props = {
		value: count,
		step: 0.01,
		onChange(value) {
			count = value;
		}
	};
	const result = renderIntoDocument(props);
	const value = getValue(result);

	ReactTestUtils.Simulate.keyDown(value, {key: 'PageDown'});
	t.is(count, 0.21);
});

test('value PageUp with step', t => {
	let count = 0.31;
	const props = {
		value: count,
		step: 0.01,
		onChange(value) {
			count = value;
		}
	};
	const result = renderIntoDocument(props);
	const value = getValue(result);

	ReactTestUtils.Simulate.keyDown(value, {key: 'PageUp'});
	t.is(count, 0.41);
});

test('disabled', t => {
	let isChanged = false;
	const props = {
		value: 3,
		disabled: true,
		onChange() {
			isChanged = true;
		}
	};
	const result = renderIntoDocument(props);

	const component = ReactTestUtils.findRenderedDOMComponentWithClass(result, 'dec-inc');
	t.regex(component.className, /dec-inc_disabled/);

	isChanged = false;
	const dec = getDec(result);
	ReactTestUtils.Simulate.mouseDown(dec);
	ReactTestUtils.Simulate.mouseUp(dec);
	t.false(isChanged, 'disable dec button');
	t.regex(dec.className, /dec-inc__control_disabled/);

	isChanged = false;
	const inc = getInc(result);
	ReactTestUtils.Simulate.mouseDown(inc);
	ReactTestUtils.Simulate.mouseUp(inc);
	t.false(isChanged, 'disable inc button');
	t.regex(inc.className, /dec-inc__control_disabled/);

	isChanged = false;
	const value = getValue(result);
	value.value = '9';
	ReactTestUtils.Simulate.change(value);
	t.false(isChanged, 'disable value input');
	t.true(value.disabled, 'value input disabled attribute');
});

// Same for inc
test.cb('repeat dec mouseDown mouseUp', t => {
	let count = 0;
	const props = {
		value: count,
		onChange() {
			count -= 1;
		}
	};
	const result = renderIntoDocument(props);

	count = 0;
	const dec = getDec(result);
	ReactTestUtils.Simulate.mouseUp(dec);
	t.is(count, 0, 'without mouseDown');

	ReactTestUtils.Simulate.mouseDown(dec);
	ReactTestUtils.Simulate.mouseUp(dec);
	t.is(count, -1, 'click');

	ReactTestUtils.Simulate.mouseDown(dec);
	setTimeout(() => {
		ReactTestUtils.Simulate.mouseUp(dec);
		let lastCount = count;
		t.true(count < -1);

		setTimeout(() => {
			t.is(count, lastCount, 'mouseUp stops handler');
			t.end();
		}, 100);
	}, 630);
});

// Same for inc
test.cb('repeat dec mouseDown mouseOut', t => {
	let count = 0;
	const props = {
		value: count,
		onChange() {
			count -= 1;
		}
	};
	const result = renderIntoDocument(props);

	count = 0;
	const dec = getDec(result);
	ReactTestUtils.Simulate.mouseOut(dec);
	t.is(count, 0, 'without mouseDown');

	ReactTestUtils.Simulate.mouseDown(dec);
	ReactTestUtils.Simulate.mouseOut(dec);
	ReactTestUtils.Simulate.mouseUp(dec);
	t.is(count, 0, 'cancel');

	ReactTestUtils.Simulate.mouseDown(dec);
	setTimeout(() => {
		ReactTestUtils.Simulate.mouseOut(dec);
		let lastCount = count;
		t.true(count < -1);

		setTimeout(() => {
			t.is(count, lastCount, 'mouseOut stops handler');
			t.end();
		}, 100);
	}, 630);
});

test('fix trailing mouseOut canceling', t => {
	let count = 0;
	const props = {
		value: count,
		onChange() {
			count -= 1;
		}
	};
	const result = renderIntoDocument(props);

	const dec = getDec(result);

	ReactTestUtils.Simulate.mouseDown(dec);
	ReactTestUtils.Simulate.mouseUp(dec);
	ReactTestUtils.Simulate.mouseOut(dec);
	t.is(count, -1);

	ReactTestUtils.Simulate.mouseDown(dec);
	ReactTestUtils.Simulate.mouseUp(dec);
	ReactTestUtils.Simulate.mouseOut(dec);
	t.is(count, -2);
});

// Shallow renderer
function createComponent(component, props = {}) {
	const shallowRenderer = ReactTestUtils.createRenderer();
	shallowRenderer.render(React.createElement(component, props));
	return shallowRenderer.getRenderOutput();
}

// Document renderer
function renderIntoDocument(props) {
	return ReactTestUtils.renderIntoDocument(React.createElement(C, props));
}

function getDec(component) {
	return getElem(component, 'dec-inc__control_type_dec');
}

function getInc(component) {
	return getElem(component, 'dec-inc__control_type_inc');
}

function getValue(component) {
	return getElem(component, 'dec-inc__value');
}

function getElem(component, className) {
	return ReactTestUtils.findRenderedDOMComponentWithClass(component, className);
}
