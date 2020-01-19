
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

		// No prefix + no suffix
		expect(generate({
			imports: ['pro-solid'],
		})).to.equal(wrapExpected(`
			import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
			import { fas } from '@fortawesome/pro-solid-svg-icons';

			Vue.component('fa', FontAwesomeIcon);
			library.add(fas);
		`));
	});

	it("imports single icons", () => {

		// Full name
		expect(generate({
			imports: [{ set: '@fortawesome/pro-solid-svg-icons', icons: ['faGuitarElectric'] }],
		})).to.equal(wrapExpected(`
			import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
			import { faGuitarElectric as fasGuitarElectric } from '@fortawesome/pro-solid-svg-icons';

			Vue.component('fa', FontAwesomeIcon);
			library.add(fasGuitarElectric);
		`));

		// No prefix
		expect(generate({
			imports: [{ set: '@fortawesome/pro-solid-svg-icons', icons: ['guitarElectric'] }],
		})).to.equal(wrapExpected(`
			import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
			import { faGuitarElectric as fasGuitarElectric } from '@fortawesome/pro-solid-svg-icons';

			Vue.component('fa', FontAwesomeIcon);
			library.add(fasGuitarElectric);
		`));

		// Kebab case
		expect(generate({
			imports: [{ set: '@fortawesome/pro-solid-svg-icons', icons: ['fa-guitar-electric'] }],
		})).to.equal(wrapExpected(`
			import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
			import { faGuitarElectric as fasGuitarElectric } from '@fortawesome/pro-solid-svg-icons';

			Vue.component('fa', FontAwesomeIcon);
			library.add(fasGuitarElectric);
		`));

		// Kebab case + no prefix
		expect(generate({
			imports: [{ set: '@fortawesome/pro-solid-svg-icons', icons: ['guitar-electric'] }],
		})).to.equal(wrapExpected(`
			import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
			import { faGuitarElectric as fasGuitarElectric } from '@fortawesome/pro-solid-svg-icons';

			Vue.component('fa', FontAwesomeIcon);
			library.add(fasGuitarElectric);
		`));

		// Spaces + no prefix
		expect(generate({
			imports: [{ set: '@fortawesome/pro-solid-svg-icons', icons: ['guitar electric'] }],
		})).to.equal(wrapExpected(`
			import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
			import { faGuitarElectric as fasGuitarElectric } from '@fortawesome/pro-solid-svg-icons';

			Vue.component('fa', FontAwesomeIcon);
			library.add(fasGuitarElectric);
		`));

		// Spaces + capitalized + no prefix
		expect(generate({
			imports: [{ set: '@fortawesome/pro-solid-svg-icons', icons: ['Guitar Electric'] }],
		})).to.equal(wrapExpected(`
			import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
			import { faGuitarElectric as fasGuitarElectric } from '@fortawesome/pro-solid-svg-icons';

			Vue.component('fa', FontAwesomeIcon);
			library.add(fasGuitarElectric);
		`));
	});
});
