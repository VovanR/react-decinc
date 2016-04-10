import test from 'ava';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import C from './';

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
	const result = createComponent(C, props);

	t.is(result.props.children[0].type, 'span');
	t.is(result.props.children[0].props.className, 'dec-inc__dec');
	t.is(result.props.children[1].type, 'input');
	t.is(result.props.children[1].props.className, 'dec-inc__value');
	t.is(result.props.children[2].type, 'span');
	t.is(result.props.children[2].props.className, 'dec-inc__inc');
});

test('disable dec if value is min', t => {
	const props = {
		value: 5,
		min: 5
	};
	const result = createComponent(C, props);

	t.is(result.props.children[0], false);
});

test('disable inc if value is max', t => {
	const props = {
		value: 5,
		max: 5
	};
	const result = createComponent(C, props);

	t.is(result.props.children[2], false);
});

test('allow to add custom class name', t => {
	const props = {
		className: 'foo bar'
	};
	const result = createComponent(C, props);

	t.is(result.props.className, 'dec-inc foo bar');
});
