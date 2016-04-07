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
