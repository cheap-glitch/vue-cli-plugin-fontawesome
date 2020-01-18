
/**
 * tests/imports.test.js
 */

const { expect }         = require('chai');
const generateImportCode = require('../src/imports');

/**
 * Helper functions
 */
const generate     = _options => generateImportCode({ component: 'fa', components: {}, ..._options});
const wrapExpected = _str => `
	import Vue from 'vue';
	import { library } from '@fortawesome/fontawesome-svg-core';
	${_str}`
	.replace(/\t+|  +|\n/g, '');

/**
 * Tests
 */
describe("import code generation", () => {

	it("imports full sets", () => {
		// Full name
		expect(generate({
			imports: ['@fortawesome/pro-solid-svg-icons'],
		})).to.equal(wrapExpected(`
			import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
			import { fas } from '@fortawesome/pro-solid-svg-icons';

			Vue.component('fa', FontAwesomeIcon);
			library.add(fas);
		`));

		// No prefix
		expect(generate({
			imports: ['pro-solid-svg-icons'],
		})).to.equal(wrapExpected(`
			import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
			import { fas } from '@fortawesome/pro-solid-svg-icons';

			Vue.component('fa', FontAwesomeIcon);
			library.add(fas);
		`));

		// No suffix
		expect(generate({
			imports: ['@fortawesome/pro-solid'],
		})).to.equal(wrapExpected(`
			import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
			import { fas } from '@fortawesome/pro-solid-svg-icons';

			Vue.component('fa', FontAwesomeIcon);
			library.add(fas);
		`));

		// Neither
		expect(generate({
			imports: ['pro-solid'],
		})).to.equal(wrapExpected(`
			import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
			import { fas } from '@fortawesome/pro-solid-svg-icons';

			Vue.component('fa', FontAwesomeIcon);
			library.add(fas);
		`));
	});

});
