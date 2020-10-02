// Insert the needed and optional dependencies into package.json
module.exports = function(api, options) {
	const dependencies = {
		'@fortawesome/vue-fontawesome':      '^0.1.9',
		'@fortawesome/fontawesome-svg-core': '^1.2.28',
	};

	// Include the selected icon sets in the list of dependencies to add
	options.iconSets.forEach(set => dependencies[`@fortawesome/${set}-svg-icons`] = '^5.13.0');

	api.extendPackage({ dependencies });
}
