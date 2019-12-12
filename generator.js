
/**
 * vue-cli-plugin-fontawesome/generator.js
 */

// Insert the needed and optional dependencies into package.json
module.exports = function(_api, _options)
{
	const dependencies = {
		'@fortawesome/vue-fontawesome':       '^0.1.8',
		'@fortawesome/fontawesome-svg-core':  '^1.2.26',
	};

	// Include the selected icon sets in the list of dependencies to add
	_options.iconSets.forEach(_set => dependencies[`@fortawesome/${_set}-svg-icons`] = '^5.12.0');

	_api.extendPackage({ dependencies });
}
