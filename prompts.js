
/**
 * vue-cli-plugin-fontawesome/prompts.js
 */

module.exports = [{
	type: 'checkbox',
	name: 'iconSets',

	pageSize: 8,

	message: 'Which icon sets do you want to use?\n'
	       + ' (Note: you can always add more later by manually adding them to the dependencies in package.json)\n',

	choices: [
		{
			type:  'separator',
			line:  '────────── Free icon sets ──────────',
		},
		{
			name:  'Solid',
			value: 'free-solid',
		},
		{
			name:  'Brands',
			value: 'free-brands',
		},
		{
			type:  'separator',
			line:  '─────────── Pro icon sets ──────────',
		},
		{
			name:  'Light',
			value: 'pro-light',
		},
		{
			name:  'Regular',
			value: 'pro-regular',
		},
		{
			name:  'Solid',
			value: 'pro-solid',
		},
		{
			name:  'Duotone',
			value: 'pro-duotone',
		},
	],

	filter(_input)
	{
		// Remove the free solid set if the pro one is also selected
		return (_input.includes('free-solid') && _input.includes('pro-solid'))
			? _input.filter(_v => _v !== 'free-solid')
			: _input;
	},
}];
