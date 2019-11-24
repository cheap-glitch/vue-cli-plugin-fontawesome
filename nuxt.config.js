
/**
 * nuxt.config.js
 */

const fs   = require('fs');
const path = require('path');

// Load some function to create Pug filters
import { dropcap, prettifyTypography } from './src/modules/typography.js';

// Define the some templates for the HTML meta tags
const title	    = `L'Atelier de Métallerie`;
const description   = process.env.npm_package_description;
const titleTemplate = _title => _title ? `${_title} — L'Atelier de Métallerie` : `L'Atelier de Métallerie`;

export default {
	mode: 'universal',

	srcDir: 'src/',

	/**
	 * Modules & plugins
	 */
	modules: [
		'@nuxtjs/style-resources',
		'nuxt-fontawesome',
	],
	plugins: [
		'~/plugins/base-components',
		'~/plugins/directives',
	],

	/**
	 * Build settings
	 */
	build: {
		loaders: {
			pugPlain: {
				filters: {
					'dropcap':		dropcap,
					'prettify-typo':	prettifyTypography,
				}
			}
		},

		html: {
			minify: {
				collapseBooleanAttributes:	true,
				collapseInlineTagWhitespace:	true,
				collapseWhitespace:		true,
				decodeEntities:			true,
				minifyCSS:			true,
				minifyJS:			true,
				removeComments:			true,
				removeEmptyAttributes:		true,
				removeRedundantAttributes:	true,
			}
		},
	},

	/**
	 * Static generation settings
	 */
	generate: {
		dir:		'build/',
		fallback:	true,
		subFolders:	false,
	},

	/**
	 * SCSS resources
	 */
	styleResources: {
		scss: [
			'sass-mq/_mq.scss',

			'./assets/styles/colorscheme.scss',
			'./assets/styles/layout.scss',
			'./assets/styles/mixins.scss',
		]
		// Display the main mq breakpoints during development
		.concat((process.env.NODE_ENV !== 'production') ? ['./assets/styles/show-breakpoints.scss'] : [])
	},

	/**
	 * Font Awesome glyphs
	 */
	fontawesome: {
		component: 'fa-icon',
		imports: [
			{
				set: '@fortawesome/pro-regular-svg-icons',
				icons: [
					'faArchway',
					'faArrowSquareLeft',
					'faArrowSquareRight',
					'faAt',
					'faBars',
					'faBorderAll',
					'faExclamationTriangle',
					'faPaperPlane',
					'faTimes',
					'faWindowClose',
					'faWrench',
				]
			},
			{
				set: '@fortawesome/pro-solid-svg-icons',
				icons: [
					'faArrowRight',
					'faCheck',
					'faCircleNotch',
					'faLongArrowDown',
					'faPaperPlane',
					'faPhoneAlt',
					'faRedo',
				]
			},
		],
	},

	/**
	 * HTML head
	 */
	head: {
		titleTemplate,
		meta: [
			{ charset: 'utf-8'												},
			{ hid: 'viewport',	   name: 'viewport',		content:  'width=device-width, initial-scale=1'		},
			{ hid: 'description',	   name: 'description',		content:   description					},
			{ hid: 'keywords',	   name: 'keywords',		content:   process.env.npm_package_keywords_0		},
			{ hid: 'application-name', name: 'application-name',	content:   title					},

			// Open Graph properties
			{ hid: 'og:type',	   name: 'og:type',		content:  'website'					},
			{ hid: 'og:locale',	   name: 'og:locale',		content:  'fr_FR'					},

			{ hid: 'og:url',	   name: 'og:url',		content:  'https://atelierdemetallerie.fr'		},
			{ hid: 'og:site_name',	   name: 'og:site_name',	content:   title					},
			{ hid: 'og:title',	   name: 'og:title',		template:  titleTemplate				},
			{ hid: 'og:description',   name: 'og:description',	content:   description					},

			{ hid: 'og:image',	   name: 'og:image',		content:  'https://atelierdemetallerie.fr/og-image.png'	},
			{ hid: 'og:image:type',	   name: 'og:image:type',	content:  'image/png'					},
			{ hid: 'og:image:width',   name: 'og:image:width',	content:  '600'						},
			{ hid: 'og:image:height',  name: 'og:image:height',	content:  '300'						},
			{ hid: 'og:image:alt',	   name: 'og:image:alt',	content:  `Logo de ${title}`				},

			// Google Search Console
			{
				hid:	 'google-site-verification',
				name:	 'google-site-verification',
				content: 'P_97PniJ3ByAIx7KiIfKBPOt7HH05KhGGn2V_Xna1u0',
			},
		],
		htmlAttrs: {
			lang: 'fr',
		},
	},
}
