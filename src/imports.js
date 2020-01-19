
/**
 * src/imports.js
 */

module.exports = function createImportCode(_options)
{
	if (!_options.imports.length) return '';

	// Build the import list for the components
	const components     = ['FontAwesomeIcon'];
	const componentNames = { FontAwesomeIcon: _options.component };
	if ('icon' in _options.components)
	{
		componentNames.FontAwesomeIcon = _options.components.icon;
	}
	if ('layers' in _options.components)
	{
		components.push('FontAwesomeLayers');
		componentNames.FontAwesomeLayers = _options.components.layers;
	}
	if ('layersText' in _options.components)
	{
		components.push('FontAwesomeLayersText');
		componentNames.FontAwesomeLayersText = _options.components.layersText;
	}

	// List of all the icon aliases to register
	const registrationList = [];

	// Build the import list for each set of icons
	const imports = _options.imports.map(function(_import)
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
		${imports.join('\n')}

		${components.map(_component => `Vue.component('${componentNames[_component]}', ${_component});` ).join('\n')}
		library.add(${registrationList.join(', ')});
	`
	.replace(/\t+|\n/g, '')
	.replace(/  +/g,   ' ');
}
