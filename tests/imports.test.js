
/**
 * tests/imports.test.js
 */

const { expect }         = require('chai');
const generateImportCode = require('../src/imports');

const generate = _options => generateImportCode({ component: 'fa', components: {}, ..._options});
const wrapTest = _str => `
		import Vue from 'vue';
		import { library } from '@fortawesome/fontawesome-svg-core';
		${_str}
	`.replace(/\t+|  +|\n/g, '');


describe("import code generation", () => {

	it("imports full sets", () => {
		expect(generate({
			imports: ['@fortawesome/pro-solid-icons-svg'],
		})).to.equal(wrapTest(`
			import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
			import { fas } from '@fortawesome/pro-solid-icons-svg-svg-icons';

			Vue.component('fa', FontAwesomeIcon);
			library.add(fas);
		`));
	});

});
