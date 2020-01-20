
/**
 * vue-cli-plugin-fontawesome
 *
 * A tiny Vue CLI plugin to import Font Awesome icons handily.
 *
 * Copyright (c) 2019-present, cheap glitch
 *
 *
 * Permission  to use,  copy, modify,  and/or distribute  this software  for any
 * purpose  with or  without  fee is  hereby granted,  provided  that the  above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS  SOFTWARE INCLUDING ALL IMPLIED  WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE  AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL  DAMAGES OR ANY DAMAGES  WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER  TORTIOUS ACTION,  ARISING OUT  OF  OR IN  CONNECTION WITH  THE USE  OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

const InjectPlugin       = require('webpack-inject-plugin').default;

const { ajv, validator } = require('./src/validation');
const generateImportCode = require('./src/imports');

// Inject an instance of the plugin in the webpack config
module.exports = (_api, _config) => _api.configureWebpack({
	plugins: [new VueCLIFontAwesomePlugin(_config.pluginOptions.fontawesome || _config.fontawesome || {})]
});

class VueCLIFontAwesomePlugin
{
	constructor(_options)
	{
		this.options = _options;

		// Validate the options object and set the defaults
		if (!validator(this.options))
			throw new Error(`[vue-cli-plugin-fontawesome]: ${ajv.errorsText(validator.errors).replace(/^data/, 'options')}`);
	}

	apply(_compiler)
	{
		// Inject the import code before compilation
		new InjectPlugin(() => generateImportCode(this.options)).apply(_compiler);
	}
}
