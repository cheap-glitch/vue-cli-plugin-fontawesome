
/**
 * vue-cli-plugin-fontawesome
 *
 * A tiny Vue CLI 3 plugin to import Font Awesome icons easily.
 *
 * Copyright (c) 2019-present, cheap glitch
 *
 *
 * Permission  to use,  copy, modify,  and/or distribute  this software  for any
 * purpose  with or  without  fee is  hereby granted,  provided  that the  above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS  SOFTWARE INCLUDING ALL IMPLIED  WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE  AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL  DAMAGES OR ANY DAMAGES  WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER  TORTIOUS ACTION,  ARISING OUT  OF  OR IN  CONNECTION WITH  THE USE  OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

const validate     = require('./validation');
const InjectPlugin = require('webpack-inject-plugin').default;

// Inject an instance of the plugin in the webpack config
module.exports = (_api, _config) => _api.configureWebpack({
	plugins: [new VueCLIFontAwesomePlugin(_config.pluginOptions.fontawesome || _config.fontawesome || {})]
});

class VueCLIFontAwesomePlugin
{
	constructor(_config)
	{
		this.options = _config;

		// Set the default options
		if ('component'  in _config === false) this.options.component  = 'fa';
		if ('components' in _config === false) this.options.components = {};
		if ('imports'    in _config === false) this.options.imports    = [];

		// Validate the config object
		const error = validate(this.options);
		if (error !== null)
		{
			console.error(`[vue-cli-plugin-fontawesome]: ${error.replace(/^data/, 'options')}`);
			process.exit(1);
		}
	}

	apply(_compiler)
	{
		new InjectPlugin(() =>
		{
			if (this.options.imports.length == 0) return '';

			// Build the import list for the components
			const components     = ['FontAwesomeIcon'];
			const componentNames = { FontAwesomeIcon: this.options.component };
			if ('icon' in this.options.components === true)
			{
				componentNames.FontAwesomeIcon = this.options.components.icon;
			}
			if ('layers' in this.options.components === true)
			{
				components.push('FontAwesomeLayers');
				componentNames.FontAwesomeLayers = this.options.components.layers;
			}
			if ('layersText' in this.options.components === true)
			{
				components.push('FontAwesomeLayersText');
				componentNames.FontAwesomeLayersText = this.options.components.layersText;
			}

			// List of all the icon aliases to register
			const registrationList = [];

			// Build the import list for each set of icons
			const imports = this.options.imports.map(function(_import)
			{
				let setPrefix = 'fa';
				const setName = (typeof _import == 'string' ? _import : _import.set).replace(/(^@fortawesome\/|-svg-icons$)/g, '');

				switch (setName)
				{
					case 'free-brands':  setPrefix = 'fab'; break;
					case 'free-solid':   setPrefix = 'fas'; break;
					case 'pro-duotone':  setPrefix = 'fad'; break;
					case 'pro-light':    setPrefix = 'fal'; break;
					case 'pro-regular':  setPrefix = 'far'; break;
					case 'pro-solid':    setPrefix = 'fas'; break;
					default:             setPrefix = 'fas'; break;
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
				import Vue from 'vue';
				import { library } from '@fortawesome/fontawesome-svg-core';
				import { ${components.join(', ')} } from '@fortawesome/vue-fontawesome';

				${components.map(_component => `Vue.component('${componentNames[_component]}', ${_component});` ).join('\n')}
				${imports.join('\n')}
				library.add(${registrationList.join(', ')});
			`
			.replace(/\t/g, '');
		})
		.apply(_compiler);
	}
}
