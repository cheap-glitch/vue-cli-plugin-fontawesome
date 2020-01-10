
/**
 * vue-cli-plugin-fontawesome/validation.js
 */

const AJV = require('ajv');

module.exports = function(_options)
{
	const patternSetName       = '^(?:@fortawesome/)?(free-(brands|solid)|pro-(duotone|light|regular|solid))(?:-svg-icons)?$';
	const patternIconName      = '^[a-zA-Z- ]+$';
	const patternComponentName = '^[a-zA-Z-_]+$';

	const schema = {
		type: 'object',

		properties: {
			/**
			 * Name of the icon component
			 */
			component: {
				type: 'string',
				pattern: patternComponentName,
				default: 'fa',
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
				additionalProperties: false,
			},

			/**
			 * Imports
			 */
			imports: {
				type: 'array',
				default: [],

				items: {
					type: ['string', 'object'],

					// If the import is a string
					pattern: patternSetName,

					// If the import is an object
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
			}
		},
		additionalProperties: false,
	};

	const validator = new AJV({ useDefaults: true });
	return !validator.validate(schema, _options) ? validator.errorsText() : null;
}
