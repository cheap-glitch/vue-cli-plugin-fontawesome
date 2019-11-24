
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
		if ('imports'   in _options === false) this.options.imports   = [];
		if ('component' in _options === false) this.options.component = 'fa';

		// Check option values
		// @TODO
	}

	apply(_compiler)
	{
		new InjectPlugin(() =>
		{
			// List of all the icon aliases to register
			const registrationList = [];

			// Build the import list for each set
			const imports = this.options.imports.map(function(_import)
			{
				let setPrefix = 'fa';
				const setName = _import.set.replace(/^@fortawesome\//, '');

				switch (setName)
				{
					case 'free-brands-svg-icons':	setPrefix = 'fab'; break;
					case 'free-solid-svg-icons':	setPrefix = 'fas'; break;
					case 'pro-duotone-svg-icons':	setPrefix = 'fad'; break;
					case 'pro-light-svg-icons':	setPrefix = 'fal'; break;
					case 'pro-regular-svg-icons':	setPrefix = 'far'; break;
					case 'pro-solid-svg-icons':	setPrefix = 'fas'; break;

					default:
						// @TODO: throw error here
						return;
				}

				// Build the list of icons to import from the set
				const icons = _import.icons.map(function(_icon)
				{
					const iconName = _icon
						// Remove a potential 'fa' prefix from the provided name
						.replace(/^fa([A-Z])/, '$1')
						// Make sure the first letter is uppercase
						.replace(/^\S/, _letter => _letter.toUpperCase());

					// Add the alias of the icon to the registration list
					const iconAlias = `${setPrefix}${iconName}`;
					registrationList.push(iconAlias);

					return `fa${iconName} as ${iconAlias}`;
				});

				return `import { ${icons.join(', ')} } from '@fortawesome/${setName}';`
			});

			const src = `
				import Vue		   from 'vue';
				import { library }	   from '@fortawesome/fontawesome-svg-core';
				import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

				Vue.component('${this.options.component}', FontAwesomeIcon);
				${imports.join('\n')}
				library.add(${registrationList.join(', ')});
			`
			.replace(/\t/g, '');

			// @DEBUG
			console.log(src);
			return src;
		})
		.apply(_compiler);
	}
}
