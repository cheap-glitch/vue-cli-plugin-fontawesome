
/**
 * tests/validation.test.js
 */

const { expect    } = require('chai');
const { validator } = require('../src/validation');

describe('options validation', () => {

	it("returns an error when there are extra properties on the main options object", () => {
		expect(validator({ foo: true })).to.be.false;
		expect(validator({ component: 'fa-icon', foo: true })).to.be.false;

		expect(validator({})).to.be.true;
	});

	it("returns an error when the main properties are not the right type", () => {
		// Component name
		expect(validator({ component: 0 })).to.be.false;
		expect(validator({ component: ['fa-icon'] })).to.be.false;

		// Components names
		expect(validator({ components: 'fa-icon' })).to.be.false;
		expect(validator({ components: ['fa-icon'] })).to.be.false;

		// Imports
		expect(validator({ imports: false })).to.be.false;
		expect(validator({ imports: 'pro-solid' })).to.be.false;
	});

	it("returns an error when the imports are invalid", () => {
		expect(validator({ imports: [{ set: [] }] })).to.be.false;
		expect(validator({ imports: [{ set: 'pro-solid' }] })).to.be.false;
		expect(validator({ imports: ['pro-duotone', []] })).to.be.false;
		expect(validator({ imports: ['pro-duotone', { icons: [] }] })).to.be.false;

		expect(validator({ imports: ['pro-duotone'] })).to.be.true;
		expect(validator({ imports: [{ set: 'pro-duotone', icons: ['guitar', 'house'] }] })).to.be.true;
	});

	it("returns an error when a component name is invalid", () => {
		// Name isn't a string
		expect(validator({ components: { icon: 0 } })).to.be.false;
		expect(validator({ components: { icon: ['fa-icon'] } })).to.be.false;

		// Name contains invalid characters
		expect(validator({ component: 'fa-icon!' })).to.be.false;
		expect(validator({ components: { icon: '@icon' } })).to.be.false;
	});

	it("returns an error when a set name is invalid", () => {
		expect(validator({ imports: ['pro'] })).to.be.false;
		expect(validator({ imports: ['@free-brands'] })).to.be.false;
		expect(validator({ imports: [{ set: 'pro', icons: [] }] })).to.be.false;
		expect(validator({ imports: [{ set: '@free-brands', icons: [] }] })).to.be.false;
	});

	it("returns an error when an icon name is invalid", () => {
		expect(validator({ imports: [{ set: 'pro-regular', icons: ['coffee!'] }] })).to.be.false;
		expect(validator({ imports: [{ set: 'pro-regular', icons: ['question_circle'] }] })).to.be.false;
		expect(validator({ imports: [{ set: 'pro-regular', icons: ['link/external'] }] })).to.be.false;

		expect(validator({ imports: [{ set: 'pro-regular', icons: ['coffee'] }] })).to.be.true;
		expect(validator({ imports: [{ set: 'pro-regular', icons: ['question-circle'] }] })).to.be.true;
		expect(validator({ imports: [{ set: 'pro-regular', icons: ['link-external'] }] })).to.be.true;
	});

});
