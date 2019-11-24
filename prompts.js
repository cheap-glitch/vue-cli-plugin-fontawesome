
/**
 * vue-cli-plugin-fontawesome/prompts.js
 */

module.exports = [
	{
		type:	 'checkbox',
		name:	 'iconSets',

		message: 'Which icon sets do you want to use? '
		       + '(Note: you can always add more later by manually '
		       + 'adding them to the dependencies in package.json)',

		choices: [
			new inquirer.Separator('Free icon sets'),
			{
				name:  'Solid',
				value: 'solid-free',
			},
			new inquirer.Separator('Pro icon sets (subscription needed)'),
			{
				name:  'Light',
				value: 'light',
			},
			{
				name:  'Regular',
				value: 'regular',
			},
			{
				name:  'Solid',
				value: 'solid-pro',
			},
			{
				name:  'Duotone',
				value: 'duotone',
			},
			new inquirer.Separator('Brand icon sets'),
			{
				name:  'Brands',
				value: 'brands',
			},
		],
		default: [],

		filter()
		{
			// Remove the free solid set if the pro one is also selected
			return (_input.includes('solid') && _input.includes('solid-free'))
				? _input.filter(_v => _v !== 'solid-free')
				: _input;
		},
	}
];
