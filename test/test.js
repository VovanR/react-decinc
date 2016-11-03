import test from 'ava';
import React from 'react';
import {mount, shallow} from 'enzyme';
import C from '../';

test('render component block', t => {
	const wrapper = shallow(<C/>);
	t.is(wrapper.type(), 'div');
	t.true(wrapper.hasClass('dec-inc'));
});

test('render childrens', t => {
	const props = {
		value: 5,
		min: 2,
		max: 9
	};
	const wrapper = mount(<C {...props}/>);

	const dec = getDec(wrapper);
	t.is(dec.type(), 'span');
	t.true(dec.hasClass('dec-inc__control'));
	t.true(dec.hasClass('dec-inc__control_type_dec'));

	const value = getValue(wrapper);
	t.is(value.type(), 'input');
	t.true(value.hasClass('dec-inc__value'));

	const inc = getInc(wrapper);
	t.is(inc.type(), 'span');
	t.true(inc.hasClass('dec-inc__control'));
	t.true(inc.hasClass('dec-inc__control_type_inc'));
});

test('disable dec if value is min', t => {
	const props = {
		value: 5,
		min: 5
	};
	const wrapper = mount(<C {...props}/>);
	const dec = getDec(wrapper);
	t.true(dec.hasClass('dec-inc__control_disabled'));
});

test('disable inc if value is max', t => {
	const props = {
		value: 5,
		max: 5
	};
	const wrapper = mount(<C {...props}/>);
	const inc = getInc(wrapper);
	t.true(inc.hasClass('dec-inc__control_disabled'));
});

test('allow to add custom class name', t => {
	const props = {
		className: 'foo bar'
	};
	const wrapper = shallow(<C {...props}/>);
	t.true(wrapper.hasClass('dec-inc foo bar'));
});

test('dec Click', t => {
	let count = 5;
	const props = {
		value: count,
		onChange(value) {
			count = value;
		}
	};
	const wrapper = mount(<C {...props}/>);
	const dec = getDec(wrapper);

	dec.simulate('mouseDown');
	dec.simulate('mouseUp');
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
	const wrapper = mount(<C {...props}/>);
	const inc = getInc(wrapper);

	inc.simulate('mouseDown');
	inc.simulate('mouseUp');
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
	const wrapper = mount(<C {...props}/>);
	const value = getValue(wrapper);

	value.simulate('keyDown', {key: 'ArrowDown'});
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
	const wrapper = mount(<C {...props}/>);
	const value = getValue(wrapper);

	value.simulate('keyDown', {key: 'ArrowUp'});
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
	const wrapper = mount(<C {...props}/>);
	const value = getValue(wrapper);

	value.simulate('keyDown', {key: 'PageDown'});
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
	const wrapper = mount(<C {...props}/>);
	const value = getValue(wrapper);

	value.simulate('keyDown', {key: 'PageUp'});
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
	const wrapper = mount(<C {...props}/>);
	const value = getValue(wrapper);

	value.simulate('keyDown', {key: 'End'});
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
	const wrapper = mount(<C {...props}/>);
	const value = getValue(wrapper);

	value.simulate('keyDown', {key: 'Home'});
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
	const wrapper = mount(<C {...props}/>);
	const value = getValue(wrapper);

	value.simulate('keyDown', {key: 'End'});
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
	const wrapper = mount(<C {...props}/>);
	const value = getValue(wrapper);

	value.simulate('keyDown', {key: 'Home'});
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
	const wrapper = mount(<C {...props}/>);
	const value = getValue(wrapper);

	value.get(0).value = '3';
	value.simulate('change');
	t.is(count, 3);

	value.get(0).value = 'foo';
	value.simulate('change');
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
	const wrapper = mount(<C {...props}/>);
	const value = getValue(wrapper);

	let isDefaultPrevented = false;
	const eventProps = {
		deltaY: 5,
		preventDefault() {
			isDefaultPrevented = true;
		}
	};

	value.simulate('wheel', eventProps);
	t.is(count, 5, 'without focus');
	t.false(isDefaultPrevented, 'without focus');
	isDefaultPrevented = false;

	value.simulate('focus');
	value.simulate('wheel', eventProps);
	t.is(count, 4);
	t.true(isDefaultPrevented, 'prevent page scroll');
	isDefaultPrevented = false;

	value.simulate('blur');
	value.simulate('wheel', eventProps);
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
	const wrapper = mount(<C {...props}/>);
	const value = getValue(wrapper);

	let isDefaultPrevented = false;
	const eventProps = {
		deltaY: -5,
		preventDefault() {
			isDefaultPrevented = true;
		}
	};

	value.simulate('wheel', eventProps);
	t.is(count, 5, 'without focus');
	t.false(isDefaultPrevented, 'without focus');
	isDefaultPrevented = false;

	value.simulate('focus');
	value.simulate('wheel', eventProps);
	t.is(count, 6);
	t.true(isDefaultPrevented, 'prevent page scroll');
	isDefaultPrevented = false;

	value.simulate('blur');
	value.simulate('wheel', eventProps);
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
	const wrapper = mount(<C {...props}/>);
	const dec = getDec(wrapper);

	dec.simulate('mouseDown');
	dec.simulate('mouseUp');
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
	const wrapper = mount(<C {...props}/>);
	const inc = getInc(wrapper);

	inc.simulate('mouseDown');
	inc.simulate('mouseUp');
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
	const wrapper = mount(<C {...props}/>);
	const value = getValue(wrapper);

	t.is(value.get(0).value, '1.00');
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
	const wrapper = mount(<C {...props}/>);
	const value = getValue(wrapper);

	value.simulate('keyDown', {key: 'PageDown'});
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
	const wrapper = mount(<C {...props}/>);
	const value = getValue(wrapper);

	value.simulate('keyDown', {key: 'PageUp'});
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
	const wrapper = mount(<C {...props}/>);

	const component = wrapper.find('.dec-inc');
	t.true(component.hasClass('dec-inc_disabled'));

	isChanged = false;
	const dec = getDec(wrapper);
	dec.simulate('mouseDown');
	dec.simulate('mouseUp');
	t.false(isChanged, 'disable dec button');
	t.true(dec.hasClass('dec-inc__control_disabled'));

	isChanged = false;
	const inc = getInc(wrapper);
	inc.simulate('mouseDown');
	inc.simulate('mouseUp');
	t.false(isChanged, 'disable inc button');
	t.true(inc.hasClass('dec-inc__control_disabled'));

	isChanged = false;
	const value = getValue(wrapper);
	value.value = '9';
	value.simulate('change');
	t.false(isChanged, 'disable value input');
	t.true(value.get(0).disabled, 'value input disabled attribute');
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
	const wrapper = mount(<C {...props}/>);

	count = 0;
	const dec = getDec(wrapper);
	dec.simulate('mouseUp');
	t.is(count, 0, 'without mouseDown');

	dec.simulate('mouseDown');
	dec.simulate('mouseUp');
	t.is(count, -1, 'click');

	dec.simulate('mouseDown');
	setTimeout(() => {
		dec.simulate('mouseUp');
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
	const wrapper = mount(<C {...props}/>);

	count = 0;
	const dec = getDec(wrapper);
	dec.simulate('mouseOut');
	t.is(count, 0, 'without mouseDown');

	dec.simulate('mouseDown');
	dec.simulate('mouseOut');
	dec.simulate('mouseUp');
	t.is(count, 0, 'cancel');

	dec.simulate('mouseDown');
	setTimeout(() => {
		dec.simulate('mouseOut');
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
	const wrapper = mount(<C {...props}/>);

	const dec = getDec(wrapper);

	dec.simulate('mouseDown');
	dec.simulate('mouseUp');
	dec.simulate('mouseOut');
	t.is(count, -1);

	dec.simulate('mouseDown');
	dec.simulate('mouseUp');
	dec.simulate('mouseOut');
	t.is(count, -2);
});

test('onChange param is not required', t => {
	let count = 0;
	const props = {
		value: count
	};
	const wrapper = mount(<C {...props}/>);

	const dec = getDec(wrapper);

	t.notThrows(() => {
		dec.simulate('mouseDown');
		dec.simulate('mouseUp');
	});
});

function getDec(component) {
	return component.find('.dec-inc__control_type_dec');
}

function getInc(component) {
	return component.find('.dec-inc__control_type_inc');
}

function getValue(component) {
	return component.find('.dec-inc__value');
}
