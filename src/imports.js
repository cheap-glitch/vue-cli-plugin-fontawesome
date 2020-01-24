
/**
 * src/imports.js
 */

module.exports = function generateImportCode(_options)
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

	// List of all the icons to import, grouped by sets
	let imports = [];
	// List of all the icon aliases to register
	const registrationList = [];

	// If the imports are a list of sets with their icons
	if (Array.isArray(_options.imports))
	{
		imports = _options.imports.map(function(_import)
		{
			const setName   = getSetName(typeof _import == 'string' ? _import : _import.set)
			const setPrefix = getSetPrefix(setName);

			// If the import is a string, import and register the entire icon set
			if (typeof _import == 'string')
			{
				registrationList.push(setPrefix);

				return { setName, setPrefix };
			}

			// Else, build the list of icons to import from the set
			const icons = _import.icons.map(function(icon)
			{
				const iconName = getIconName(icon);

				// Add the alias of the icon to the registration list
				const iconAlias = `${setPrefix}${iconName}`;
				registrationList.push(iconAlias);

				return {
					name:  iconName,
					alias: iconAlias,
				}
			});

			return { setName, icons };
		});
	}
	// If the imports are a map of icons to sets
	else
	{
		const sets = {};

		// Group the icons by set
		Object.keys(_options.imports).forEach(function(icon)
		{
			const iconName = getIconName(icon);

			// Add the icon to every specified set
			[..._options.imports[icon]].forEach(function(set)
			{
				const setName   = getSetName(set);
				const setPrefix = getSetPrefix(setName);

				// Add the alias of the icon to the registration list
				const iconAlias = `${setPrefix}${iconName}`;
				registrationList.push(iconAlias);

				const icon = {
					name:  iconName,
					alias: iconAlias,
				}

				if (setName in sets)
					sets[setName].push(icon);
				else
					sets[setName] = [icon];
			});
		});

		// Generate a list of sets with icons
		return Object.keys(sets).map(function(set)
		{
			return {
				setName: set,
				icons:   sets[set],
			}
		});
	}

	// Build the import syntax for the icons
	const iconsImports = imports.map(function(importObj)
	{
		const iconsList = ('icons' in importObj)
		                ? importObj.icons.map(icon => `fa${icon.name} as ${icon.alias}`).join(', ')
		                : importObj.setPrefix;

		return `import { ${iconsList} } from '@fortawesome/${importObj.setName}-svg-icons';`
	});

	return `
		import Vue from 'vue';
		import { library } from '@fortawesome/fontawesome-svg-core';
		import { ${components.join(', ')} } from '@fortawesome/vue-fontawesome';
		${ iconsImports.join('\n') }

		${components.map(_component => `Vue.component('${componentNames[_component]}', ${_component});` ).join('\n')}
		library.add(${registrationList.join(', ')});
	`
	.replace(/\t+|\n/g, '')
	.replace(/  +/g,   ' ');
}

function getIconName(icon)
{
	// If the name has spaces in it, convert it to valid kebab case
	return (icon.includes(' ') ? icon.replace(/ +/g, '-').toLowerCase() : icon)

		// Convert kebab case names to camel case
		.replace(/-[a-z]/g, _match => _match.slice(1).toUpperCase())

		// Remove a potential 'fa' prefix from the provided name
		.replace(/^fa([A-Z])/, '$1')

		// Make sure the first letter is uppercase
		.replace(/^\S/, _letter => _letter.toUpperCase());
}

function getSetName(importSetName)
{
	return importSetName.replace(/(^@fortawesome\/|-svg-icons$)/g, '');
}

function getSetPrefix(setName)
{
	switch (setName)
	{
		case 'free-brands':  return 'fab';
		case 'free-solid':   return 'fas';
		case 'pro-duotone':  return 'fad';
		case 'pro-light':    return 'fal';
		case 'pro-regular':  return 'far';
		case 'pro-solid':    return 'fas';
		default:             return  'fa';
	}
}
