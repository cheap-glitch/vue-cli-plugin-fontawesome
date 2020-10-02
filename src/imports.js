module.exports = function generateImportCode(options) {
	if ((Array.isArray(options.imports) && !options.imports.length) || !Object.keys(options.imports).length)
		return '';

	// Build the import list for the components
	const components     = ['FontAwesomeIcon'];
	const componentNames = { FontAwesomeIcon: options.component };
	if ('icon' in options.components) {
		componentNames.FontAwesomeIcon = options.components.icon;
	}
	if ('layers' in options.components) {
		components.push('FontAwesomeLayers');
		componentNames.FontAwesomeLayers = options.components.layers;
	}
	if ('layersText' in options.components) {
		components.push('FontAwesomeLayersText');
		componentNames.FontAwesomeLayersText = options.components.layersText;
	}

	// List of all the icons to import, grouped by sets
	let imports = [];
	// List of all the icon aliases to register
	const registrationList = [];

	// If the imports are a list of sets with their icons
	if (Array.isArray(options.imports)) {
		imports = options.imports.map(function(importItem) {
			const setName   = getSetName(typeof importItem == 'string' ? importItem : importItem.set)
			const setPrefix = getSetPrefix(setName);

			// If the import is a string, import and register the entire icon set
			if (typeof importItem == 'string') {
				registrationList.push(setPrefix);

				return { setName, setPrefix };
			}

			// Else, build the list of icons to import from the set
			const icons = importItem.icons.map(function(icon) {
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
	// If the imports are a map of icons to sets
	} else {
		const sets = {};

		// Group the icons by set
		Object.keys(options.imports).forEach(function(icon) {
			const iconName = getIconName(icon);
			const iconSets = options.imports[icon];

			// Add the icon to every specified set
			(Array.isArray(iconSets) ? iconSets : [iconSets])
				.forEach(function(set) {
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
		imports = Object.keys(sets).map(set => ({
			setName: set,
			icons:   sets[set],
		}));
	}

	// Build the import syntax for the icons
	const iconsImports = imports.map(function(importObj) {
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

		${components.map(component => `Vue.component('${componentNames[component]}', ${component});` ).join('\n')}
		library.add(${registrationList.join(', ')});
	`
	.replace(/\t+|\n/g, '')
	.replace(/  +/g,   ' ');
}

function getIconName(icon) {
	// If the name has spaces in it, convert it to valid kebab case
	return (icon.includes(' ') ? icon.replace(/ +/g, '-').toLowerCase() : icon)

		// Convert kebab case names to camel case
		.replace(/-[a-z]/g, match => match.slice(1).toUpperCase())

		// Remove a potential 'fa' prefix from the provided name
		.replace(/^fa([A-Z])/, '$1')

		// Make sure the first letter is uppercase
		.replace(/^\S/, letter => letter.toUpperCase());
}

function getSetName(importSetName) {
	return importSetName.replace(/(^@fortawesome\/|-svg-icons$)/g, '');
}

function getSetPrefix(setName) {
	switch (setName) {
		case 'free-brands':  return 'fab';
		case 'free-solid':   return 'fas';
		case 'pro-duotone':  return 'fad';
		case 'pro-light':    return 'fal';
		case 'pro-regular':  return 'far';
		case 'pro-solid':    return 'fas';
		default:             return  'fa';
	}
}
