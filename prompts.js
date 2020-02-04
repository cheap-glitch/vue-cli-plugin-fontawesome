
/**
 * vue-cli-plugin-fontawesome/prompts.js
 */

module.exports = [{
	type: 'checkbox',
	name: 'iconSets',

	pageSize: 8,

	message: 'Select some icon sets to install',

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

	filter(input)
	{
		// Remove the free solid set if the pro one is also selected
		return (input.includes('free-solid') && input.includes('pro-solid'))
			? input.filter(v => v !== 'free-solid')
			: input;
	},
}];
