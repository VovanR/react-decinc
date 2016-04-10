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

function createComponent(component, props = {}) {
	const shallowRenderer = ReactTestUtils.createRenderer();
	shallowRenderer.render(React.createElement(component, props));
	return shallowRenderer.getRenderOutput();
}

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
	const result = ReactTestUtils.renderIntoDocument(React.createElement(C, props));

	const dec = ReactTestUtils.findRenderedDOMComponentWithClass(result, 'dec-inc__control_type_dec');
	t.is(dec.nodeName, 'SPAN');
	t.is(dec.className, 'dec-inc__control dec-inc__control_type_dec');

	const value = ReactTestUtils.findRenderedDOMComponentWithClass(result, 'dec-inc__value');
	t.is(value.nodeName, 'INPUT');
	t.is(value.className, 'dec-inc__value');

	const inc = ReactTestUtils.findRenderedDOMComponentWithClass(result, 'dec-inc__control_type_inc');
	t.is(inc.nodeName, 'SPAN');
	t.is(inc.className, 'dec-inc__control dec-inc__control_type_inc');
});

test('disable dec if value is min', t => {
	const props = {
		value: 5,
		min: 5
	};
	const result = ReactTestUtils.renderIntoDocument(React.createElement(C, props));

	const dec = ReactTestUtils.findRenderedDOMComponentWithClass(result, 'dec-inc__control_type_dec');
	t.regex(dec.className, /dec-inc__control_disabled/);
});

test('disable inc if value is max', t => {
	const props = {
		value: 5,
		max: 5
	};
	const result = ReactTestUtils.renderIntoDocument(React.createElement(C, props));

	const inc = ReactTestUtils.findRenderedDOMComponentWithClass(result, 'dec-inc__control_type_inc');
	t.regex(inc.className, /dec-inc__control_disabled/);
});

test('allow to add custom class name', t => {
	const props = {
		className: 'foo bar'
	};
	const result = createComponent(C, props);

	t.is(result.props.className, 'dec-inc foo bar');
});
