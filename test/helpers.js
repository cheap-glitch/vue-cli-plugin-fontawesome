const generateImportCode = require('../src/imports');

function generate(options) {
	return generateImportCode({ component: 'fa', components: {}, ...options});
}

function wrapExpected(str) {
	return `import Vue from 'vue';
		import { library } from '@fortawesome/fontawesome-svg-core';
		${str}`
		.replace(/\t+|\n/g, '').replace(/  +/g, ' ');
}

module.exports = {
	generate,
	wrapExpected,
};
