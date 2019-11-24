
/**
 * vue-cli-plugin-fontawesome/index.js
 * A Vue CLI 3 plugin to import Font Awesome icons easily
 *
 * Copyright 2019 cheap-glitch
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE
 * FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY
 * DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,
 * WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS
 * ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE
 * OF THIS SOFTWARE.
 */

const InjectPlugin = require('webpack-inject-plugin').default;

module.exports = class VueCLIFontAwesomePlugin
{
	constructor(_options)
	{
		this.options = _options;

		// Set the default options
		if ('component' in _options === false) this.options.component = 'fa';
		if ('imports'   in _options === false) this.options.imports   = [];

		// Check options types
		if (typeof this.options.component != 'string')
			die('Property "component" must be a string');
		if (!Array.isArray(this.options.imports))
			die('Property "imports" must be an array');

		// Check that the every import parameter is either a string or a proper object
		if (this.options.imports.some(_import => (typeof _import != 'string' && _import !== Object(_import))))
			die('Values in array "imports" must be strings or objects');

		// If the an import parameter is an object, check that
		// it has the two required values and that they are of the right type
		this.options.imports.forEach(function(_import)
		{
			if (typeof _import == 'string') return;

			if ('set' in _import === false || 'icons' in _import === false)
				die('Objects in array "imports" must have properties "set" and "icons"');

			if (typeof _import.set != 'string')
				die('Property "set" of import object must be a string');
			if (!Array.isArray(_import.icons))
				die('Property "icons" of import object must be an array');

			if (_import.icons.some(_iconName => typeof _iconName != 'string'))
				die('Values in array "icons" must be strings');
		});
	}

	apply(_compiler)
	{
		new InjectPlugin(() =>
		{
			if (this.options.imports.length == 0) return '';

			// List of all the icon aliases to register
			const registrationList = [];

			// Build the import list for each set
			const imports = this.options.imports.map(function(_import)
			{
				let setPrefix = 'fa';
				const setName = (typeof _import == 'string' ? _import : _import.set).replace(/(^@fortawesome\/|-svg-icons$)/g, '');

				switch (setName)
				{
					case 'free-brands':	setPrefix = 'fab'; break;
					case 'free-solid':	setPrefix = 'fas'; break;
					case 'pro-duotone':	setPrefix = 'fad'; break;
					case 'pro-light':	setPrefix = 'fal'; break;
					case 'pro-regular':	setPrefix = 'far'; break;
					case 'pro-solid':	setPrefix = 'fas'; break;

					default: die(`Unknown icon set "${_import.set}"`);
				}

				// If the import is a string, imports and register the entire icon set
				if (typeof _import == 'string')
				{
					registrationList.push(setPrefix);
					return `import { ${setPrefix} } from '@fortawesome/${setName}-svg-icons';`;
				}

				// Build the list of icons to import from the set
				const icons = _import.icons.map(function(_icon)
				{
					const iconName =
						// If the name has spaces in it, convert it to valid kebab case
						(_icon.includes(' ') ? _icon.replace(/ +/g, '-').toLowerCase() : _icon)

						// Convert kebab case names to camel case
						.replace(/-[a-z]/g, _match => _match.slice(1).toUpperCase())

						// Remove a potential 'fa' prefix from the provided name
						.replace(/^fa([A-Z])/, '$1')

						// Make sure the first letter is uppercase
						.replace(/^\S/, _letter => _letter.toUpperCase());

					// Add the alias of the icon to the registration list
					const iconAlias = `${setPrefix}${iconName}`;
					registrationList.push(iconAlias);

					return `fa${iconName} as ${iconAlias}`;
				});

				return `import { ${icons.join(', ')} } from '@fortawesome/${setName}-svg-icons';`
			});

			return `
				import Vue		   from 'vue';
				import { library }	   from '@fortawesome/fontawesome-svg-core';
				import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

				Vue.component('${this.options.component}', FontAwesomeIcon);
				${imports.join('\n')}
				library.add(${registrationList.join(', ')});
			`
			.replace(/\t/g, '');
		})
		.apply(_compiler);
	}
}

/**
 * Output an error message and stop the current process
 */
function die(_msg)
{
	console.error(`[vue-cli-plugin-fontawesome]: ERROR: ${_msg}`);
	process.exit(1);
}
