const AJV = require('ajv');

const patternSetName       = '^(?:@fortawesome/)?(free-(brands|solid)|pro-(duotone|light|regular|solid))(?:-svg-icons)?$';
const patternIconName      = '^[a-zA-Z- ]+$';
const patternComponentName = '^[a-zA-Z-_]+$';

const ajv       = new AJV({ useDefaults: true });
const validator = ajv.compile(
{
	type: 'object',

	properties: {
		/**
		 * Name of the icon component
		 */
		component: {
			type: 'string',
			default: 'fa',

			pattern: patternComponentName,
		},

		/**
		 * Names of all the components
		 */
		components: {
			type: 'object',
			default: {},

			properties: {
				icon: {
					type: 'string',
					pattern: patternComponentName,
				},
				layers: {
					type: 'string',
					pattern: patternComponentName,
				},
				layersText: {
					type: 'string',
					pattern: patternComponentName,
				}
			},
			additionalProperties: false
		},

		/**
		 * Imports
		 */
		imports: {
			type: ['array', 'object'],
			default: [],

			// List of sets + icons
			items: {
				type: ['string', 'object'],

				pattern: patternSetName,

				properties: {
					set: {
						type: 'string',
						pattern: patternSetName,
					},
					icons: {
						type: 'array',
						items: {
							type: 'string',
							pattern: patternIconName,
						},
					}
				},
				required: ['set', 'icons'],
				additionalProperties: false,
			},

			// Map of icons --> sets
			patternProperties: {
				[patternIconName]: {
					type: ['string', 'array'],

					pattern: patternSetName,

					items: {
						type: 'string',

						pattern: patternSetName,
					}
				}
			},
			additionalProperties: false
		}
	},
	additionalProperties: false
});

module.exports = {
	ajv,
	validator,
}
