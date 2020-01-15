
/**
 * tests/validation.test.js
 */

const { expect } = require('chai');
const validate   = require('../src/validation');

describe('vue-cli-plugin-fontawesome options validation', () => {

	it("returns an error when there are extra properties on the main options object", () => {
		expect(validate({ foo: true })).not.to.be.null;
		expect(validate({ component: 'fa-icon', foo: true })).not.to.be.null;
	});

	it("returns an error when the main properties are not the right type", () => {
		// Component name
		expect(validate({ component: 0 })).not.to.be.null;
		expect(validate({ component: ['fa-icon'] })).not.to.be.null;

		// Components names
		expect(validate({ components: 'fa-icon' })).not.to.be.null;
		expect(validate({ components: ['fa-icon'] })).not.to.be.null;

		// Imports
		expect(validate({ imports: 'pro-solid' })).not.to.be.null;
		expect(validate({ imports: {} })).not.to.be.null;
	});

	it("returns an error when the imports are invalid", () => {
		expect(validate({ imports: [{ set: [] }] })).not.to.be.null;
		expect(validate({ imports: [{ set: 'pro-solid' }] })).not.to.be.null;
		expect(validate({ imports: ['pro-duotone', []] })).not.to.be.null;
		expect(validate({ imports: ['pro-duotone', { icons: [] }] })).not.to.be.null;
	});

	it("returns an error when a component name is invalid", () => {
		// Name isn't a string
		expect(validate({ components: { icon: 0 } })).not.to.be.null;
		expect(validate({ components: { icon: ['fa-icon'] } })).not.to.be.null;

		// Name contains invalid characters
		expect(validate({ component: 'fa-icon!' })).not.to.be.null;
		expect(validate({ components: { icon: '@icon' } })).not.to.be.null;
	});

	it("returns an error when a set name is invalid", () => {
		expect(validate({ imports: ['pro'] })).not.to.be.null;
		expect(validate({ imports: ['@free-brands'] })).not.to.be.null;

		expect(validate({ imports: [{ set: 'pro', icons: [] }] })).not.to.be.null;
		expect(validate({ imports: [{ set: '@free-brands', icons: [] }] })).not.to.be.null;
	});

	it("returns an error when an icon name is invalid", () => {
		expect(validate({ imports: [{ set: 'pro-regular', icons: ['coffee!'] }] })).not.to.be.null;
		expect(validate({ imports: [{ set: 'pro-regular', icons: ['question_circle'] }] })).not.to.be.null;
		expect(validate({ imports: [{ set: 'pro-regular', icons: ['link/external'] }] })).not.to.be.null;
	});

});
