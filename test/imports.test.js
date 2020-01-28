
/**
 * tests/imports.test.js
 */

const { expect }         = require('chai');
const generateImportCode = require('../src/imports');

/**
 * Helper functions
 */
const generate     = options => generateImportCode({ component: 'fa', components: {}, ...options});
const wrapExpected = str => `
	import Vue from 'vue';
	import { library } from '@fortawesome/fontawesome-svg-core';
	${str}`
	.replace(/\t+|\n/g, '')
	.replace(/  +/g,   ' ');

/**
 * Tests
 */
describe("import code generation", () => {

	it("imports nothing if no sets or icons are given to import", () => {
		expect(generate({ imports: [] })).to.equal('');
		expect(generate({ imports: {} })).to.equal('');
	});

	/**
	 * Components
	 * {{{
	 * ---------------------------------------------------------------------
	 */
	it("imports the Vue components", () => {

		// Just the icon component
		expect(generate({
			component: 'font-awesome-icon',
			imports: ['@fortawesome/pro-solid-svg-icons'],
		})).to.equal(wrapExpected(`
			import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
			import { fas } from '@fortawesome/pro-solid-svg-icons';

			Vue.component('font-awesome-icon', FontAwesomeIcon);
			library.add(fas);
		`));

		// All the components
		expect(generate({
			components: {
				icon:       'font-awesome-icon',
				layers:     'font-awesome-layers',
				layersText: 'font-awesome-layers-text',
			},
			imports: ['@fortawesome/pro-solid-svg-icons'],
		})).to.equal(wrapExpected(`
			import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome';
			import { fas } from '@fortawesome/pro-solid-svg-icons';

			Vue.component('font-awesome-icon',         FontAwesomeIcon);
			Vue.component('font-awesome-layers',       FontAwesomeLayers);
			Vue.component('font-awesome-layers-text',  FontAwesomeLayersText);
			library.add(fas);
		`));
	});
	/**
	 * }}}
	 */

	/**
	 * Set + icons list
	 * {{{
	 * ---------------------------------------------------------------------
	 */
	describe("set + icons list", () => {

		it("imports full sets", () => {

			// Full name
			expect(generate({
				imports: ['@fortawesome/pro-solid-svg-icons']
			})).to.equal(wrapExpected(`
				import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
				import { fas } from '@fortawesome/pro-solid-svg-icons';

				Vue.component('fa', FontAwesomeIcon);
				library.add(fas);
			`));

			// No prefix
			expect(generate({
				imports: ['pro-solid-svg-icons']
			})).to.equal(wrapExpected(`
				import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
				import { fas } from '@fortawesome/pro-solid-svg-icons';

				Vue.component('fa', FontAwesomeIcon);
				library.add(fas);
			`));

			// No suffix
			expect(generate({
				imports: ['@fortawesome/pro-solid']
			})).to.equal(wrapExpected(`
				import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
				import { fas } from '@fortawesome/pro-solid-svg-icons';

				Vue.component('fa', FontAwesomeIcon);
				library.add(fas);
			`));

			// No prefix + no suffix
			expect(generate({
				imports: ['pro-solid']
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
				imports: [{ set: '@fortawesome/pro-solid-svg-icons', icons: ['faGuitarElectric'] }]
			})).to.equal(wrapExpected(`
				import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
				import { faGuitarElectric as fasGuitarElectric } from '@fortawesome/pro-solid-svg-icons';

				Vue.component('fa', FontAwesomeIcon);
				library.add(fasGuitarElectric);
			`));

			// No prefix
			expect(generate({
				imports: [{ set: '@fortawesome/pro-solid-svg-icons', icons: ['guitarElectric'] }]
			})).to.equal(wrapExpected(`
				import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
				import { faGuitarElectric as fasGuitarElectric } from '@fortawesome/pro-solid-svg-icons';

				Vue.component('fa', FontAwesomeIcon);
				library.add(fasGuitarElectric);
			`));

			// Kebab case
			expect(generate({
				imports: [{ set: '@fortawesome/pro-solid-svg-icons', icons: ['fa-guitar-electric'] }]
			})).to.equal(wrapExpected(`
				import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
				import { faGuitarElectric as fasGuitarElectric } from '@fortawesome/pro-solid-svg-icons';

				Vue.component('fa', FontAwesomeIcon);
				library.add(fasGuitarElectric);
			`));

			// Kebab case + no prefix
			expect(generate({
				imports: [{ set: '@fortawesome/pro-solid-svg-icons', icons: ['guitar-electric'] }]
			})).to.equal(wrapExpected(`
				import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
				import { faGuitarElectric as fasGuitarElectric } from '@fortawesome/pro-solid-svg-icons';

				Vue.component('fa', FontAwesomeIcon);
				library.add(fasGuitarElectric);
			`));

			// Spaces + no prefix
			expect(generate({
				imports: [{ set: '@fortawesome/pro-solid-svg-icons', icons: ['guitar electric'] }]
			})).to.equal(wrapExpected(`
				import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
				import { faGuitarElectric as fasGuitarElectric } from '@fortawesome/pro-solid-svg-icons';

				Vue.component('fa', FontAwesomeIcon);
				library.add(fasGuitarElectric);
			`));

			// Spaces + capitalized + no prefix
			expect(generate({
				imports: [{ set: '@fortawesome/pro-solid-svg-icons', icons: ['Guitar Electric'] }]
			})).to.equal(wrapExpected(`
				import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
				import { faGuitarElectric as fasGuitarElectric } from '@fortawesome/pro-solid-svg-icons';

				Vue.component('fa', FontAwesomeIcon);
				library.add(fasGuitarElectric);
			`));
		});

		it("imports collections of icons", () => {
			expect(generate({
				imports: [{ set: '@fortawesome/pro-solid-svg-icons', icons: ['faGuitar', 'guitar-amp', 'bass', 'drum'] }]
			})).to.equal(wrapExpected(`
				import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
				import { faGuitar as fasGuitar, faGuitarAmp as fasGuitarAmp, faBass as fasBass, faDrum as fasDrum } from '@fortawesome/pro-solid-svg-icons';

				Vue.component('fa', FontAwesomeIcon);
				library.add(fasGuitar, fasGuitarAmp, fasBass, fasDrum);
			`));
		});

		it("imports the same icon from different sets", () => {
			expect(generate({
				imports: [
					{ set: '@fortawesome/pro-solid-svg-icons',    icons: ['guitar'] },
					{ set: '@fortawesome/pro-regular-svg-icons',  icons: ['guitar'] },
					{ set: '@fortawesome/pro-duotone-svg-icons',  icons: ['guitar'] },
					{ set: '@fortawesome/pro-light-svg-icons',    icons: ['guitar'] },
				]
			})).to.equal(wrapExpected(`
				import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

				import { faGuitar as fasGuitar } from '@fortawesome/pro-solid-svg-icons';
				import { faGuitar as farGuitar } from '@fortawesome/pro-regular-svg-icons';
				import { faGuitar as fadGuitar } from '@fortawesome/pro-duotone-svg-icons';
				import { faGuitar as falGuitar } from '@fortawesome/pro-light-svg-icons';

				Vue.component('fa', FontAwesomeIcon);
				library.add(fasGuitar, farGuitar, fadGuitar, falGuitar);
			`));
		});

		it("imports different icons from different sets", () => {
			expect(generate({
				imports: [
					{ set: '@fortawesome/free-brands-svg-icons',  icons: ['twitter'] },
					{ set: '@fortawesome/free-solid-svg-icons',   icons: ['guitar']  },
					{ set: '@fortawesome/pro-regular-svg-icons',  icons: ['laptop']  },
					{ set: '@fortawesome/pro-duotone-svg-icons',  icons: ['folders'] },
					{ set: '@fortawesome/pro-light-svg-icons',    icons: ['copy']    },
					{ set: '@fortawesome/unknown-set',            icons: ['user']    },
				]
			})).to.equal(wrapExpected(`
				import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

				import { faTwitter as fabTwitter } from '@fortawesome/free-brands-svg-icons';
				import { faGuitar  as fasGuitar  } from '@fortawesome/free-solid-svg-icons';
				import { faLaptop  as farLaptop  } from '@fortawesome/pro-regular-svg-icons';
				import { faFolders as fadFolders } from '@fortawesome/pro-duotone-svg-icons';
				import { faCopy    as falCopy    } from '@fortawesome/pro-light-svg-icons';
				import { faUser    as faUser     } from '@fortawesome/unknown-set-svg-icons';

				Vue.component('fa', FontAwesomeIcon);
				library.add(fabTwitter, fasGuitar, farLaptop, fadFolders, falCopy, faUser);
			`));
		});
	});
	/**
	 * }}}
	 */

	/**
	 * Icons --> set(s) map
	 * {{{
	 * ---------------------------------------------------------------------
	 */
	describe("icons --> set(s) map", () => {

		it("imports icons from a single set", () => {
			expect(generate({
				imports: {
					faGuitar:            '@fortawesome/free-solid-svg-icons',
					'folder-music':      'pro-duotone-svg-icons',
					'creative commons':  'free-brands',
				}
			})).to.equal(wrapExpected(`
				import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

				import { faGuitar          as fasGuitar          } from '@fortawesome/free-solid-svg-icons';
				import { faFolderMusic     as fadFolderMusic     } from '@fortawesome/pro-duotone-svg-icons';
				import { faCreativeCommons as fabCreativeCommons } from '@fortawesome/free-brands-svg-icons';

				Vue.component('fa', FontAwesomeIcon);
				library.add(fasGuitar, fadFolderMusic, fabCreativeCommons);
			`));
		});

		it("imports a single icon from multilple sets", () => {
			expect(generate({
				imports: {
					guitar: ['@fortawesome/free-solid-svg-icons', 'pro-duotone-svg-icons', 'pro-light']
				}
			})).to.equal(wrapExpected(`
				import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

				import { faGuitar as fasGuitar } from '@fortawesome/free-solid-svg-icons';
				import { faGuitar as fadGuitar } from '@fortawesome/pro-duotone-svg-icons';
				import { faGuitar as falGuitar } from '@fortawesome/pro-light-svg-icons';

				Vue.component('fa', FontAwesomeIcon);
				library.add(fasGuitar, fadGuitar, falGuitar);
			`));
		});

		it("imports several icons from multilple sets", () => {
			expect(generate({
				imports: {
					guitar: ['@fortawesome/free-solid-svg-icons', 'pro-duotone-svg-icons', 'pro-light'],
					bass:   ['@fortawesome/free-solid-svg-icons', 'pro-duotone-svg-icons', 'pro-light'],
				}
			})).to.equal(wrapExpected(`
				import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

				import { faGuitar as fasGuitar, faBass as fasBass } from '@fortawesome/free-solid-svg-icons';
				import { faGuitar as fadGuitar, faBass as fadBass } from '@fortawesome/pro-duotone-svg-icons';
				import { faGuitar as falGuitar, faBass as falBass } from '@fortawesome/pro-light-svg-icons';

				Vue.component('fa', FontAwesomeIcon);
				library.add(fasGuitar, fadGuitar, falGuitar, fasBass, fadBass, falBass);
			`));
		});
	});
	/**
	 * }}}
	 */
});
