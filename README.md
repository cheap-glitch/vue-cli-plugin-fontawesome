<p align="center">
	<img src="https://raw.githubusercontent.com/cheap-glitch/vue-cli-plugin-fontawesome/master/docs/logo-wide.png" alt="logo">
</p>

<div align="center"><h1>vue-cli-plugin-fontawesome</h1></div>
![license badge](https://badgen.net/badge/license/ISC/green)
![latest release badge](https://badgen.net/github/release/cheap-glitch/vue-cli-plugin-fontawesome?color=green)
[![codecov badge](https://codecov.io/gh/cheap-glitch/vue-cli-plugin-fontawesome/branch/master/graph/badge.svg)](https://codecov.io/gh/cheap-glitch/vue-cli-plugin-fontawesome)

Using [Font Awesome  5](https://fontawesome.com) in a Vue.js  project is already
pretty simple, but you  still have to work with a  verbose and repetitive syntax
in order to benefit  from tree-shaking and include only the  needed icons in the
final bundle.  This tiny  plugin allows  you to manage  your icon  sets directly
from  your  `vue.config.js`  file,  avoiding boilerplate  code  and  error-prone
repetitions.

## Installation

```
vue add @cheap-glitch/fontawesome
```

The install  prompt will ask  you which icon sets  you want to  be automatically
included in  your `package.json` and downloaded.  You can leave all  the options
unchecked if  you'd rather add  them manually.  Regardless of your  choices, two
packages will always be added and downloaded:
 * [fontawesome-svg-core](https://www.npmjs.com/package/@fortawesome/fontawesome-svg-core)
 * [vue-fontawesome](https://github.com/FortAwesome/vue-fontawesome)

No other file will be modified during the installation process.

> Note: if you want to install pro icon sets, make sure you have a `.npmrc` file
> at the root of your project with  your token in it, otherwise the installation
> will fail (cf. ["Installing the Pro version of Font
> Awesome"](https://fontawesome.com/how-to-use/on-the-web/setup/using-package-managers#installing-pro)).

## Usage
```javascript
// vue.config.js

// The config object should be placed inside 'pluginOptions'
fontawesome: {

	// Defines the name of the Font Awesome component
	// used inside Vue templates (optional, defaults to 'fa')
	component: 'fa-icon',

	// Defines the names of all the Font Awesome
	// components that will be imported (optional)
	components: {
		icon:       'fa-icon',
		layers:     'fa-layers',
		layersText: 'fa-layers-text',
	},

	// Lists the imported icons
	imports: [
		{
			set: '@fortawesome/free-solid-svg-icons',
			icons: [
				'faUser',
				'faFileUpload',
				'faFrenchFries',
			]
		},
		{
			// You can omit the '@fortawesome/' prefix in the set name
			set: 'pro-duotone-svg-icons',
			icons: [
				// You can omit the 'fa' prefix in the icon names
				'guitar',
				'fax',
				'fastForward',

				// You can also spell the name in kebab case
				'spider-black-widow',

				// Or with spaces
				'dumpster fire',
			]
		},
		{
			// You can also omit the '-svg-icons' suffix
			set: 'free-brands',
			icons: [
				'faVuejs',
				'creative-commons'
				'Fort Awesome',
			]
		},
		// Specifying only a name will load the entire icon set
		// WARNING: This is only suitable for the prototyping phase,
		//          as every single icon in the set will be included
		//          in the final bundle!
		'pro-light',
	]
}
```

You can then  use the Font Awesome components in your templates.  For more info,
see [here](https://github.com/FortAwesome/vue-fontawesome#usage).

#### Automatically rebuild when `vue.config.js` is modified

Unfortunately,   Vue  CLI   doesn't   watch  edits   made  on   `vue.config.js`.
To    get    automatic    rebuilds,    you    can    use    a    watcher    like
[nodemon](https://www.npmjs.com/package/nodemon):
```json
"scripts": {
	"serve": "nodemon --watch vue.config.js --exec npm run serve-vue-cli",
	"serve-vue-cli": "vue-cli-service serve"
}
```
Note  that you'll  still  need to  reload  the page  manually  as the  WebSocket
connection with the local server will be lost.

## Changelog
See the full changelog [here](https://github.com/cheap-glitch/vue-cli-plugin-fontawesome/releases).

## Acknowledgements
This plugin depends on the awesome [webpack-inject-plugin](https://github.com/adierkens/webpack-inject-plugin).

This plugin is heavily inspired by its Nuxt.js counterpart, [nuxt-fontawesome](https://github.com/vaso2/nuxt-fontawesome).

## License
This software is distributed under the ISC license.
