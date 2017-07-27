//
// LESERKRITIKK v2 (aka Reader Critics)
// Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// https://github.com/dbmedialab/reader-critics/
//
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with
// this program. If not, see <http://www.gnu.org/licenses/>.
//

/* eslint-disable quote-props, import/no-extraneous-dependencies */

const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const LodashPlugin = require('lodash-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { isArray } = require('lodash');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

const isProduction = process.env.NODE_ENV === 'production';

const typescriptConfig = path.join(__dirname, 'tsconfig.json');

// Loaders

const BabelLoader = {
	loader: 'babel-loader',
	options: {
		presets: ['es2015', 'react'],
		// plugins: [ 'lodash' ],
	},
};

const TypeScriptLoader = {
	loader: 'awesome-typescript-loader?silent=true',
	options: {
		configFileName: typescriptConfig,
	},
};

// Plugins

const TypeScriptPathsPlugin = new TsConfigPathsPlugin({
	configFileName: typescriptConfig,
	compiler: 'typescript',
});

const OrderPlugin = new webpack.optimize.OccurrenceOrderPlugin();

const UglifyPlugin = new webpack.optimize.UglifyJsPlugin();

// SASS Plugin, can be used multiple times

const createSassModule = (sassPlugin, pattern) => ({
	test: pattern,
	use: sassPlugin.extract({
		use: [{
			loader: 'css-loader?-url',
		}, {
			loader: 'sass-loader',
		}],
		// use style-loader in development
		fallback: 'style-loader',
	}),
});

/**
 * Main Webpack configuration.
 * Creates a config object with project-default settings that can be extended
 * later, before finally returning the finished configuration to Webpack.
 *
 * @param applicationPart The name of the application part that to be bundled,
 *   referring to a sub directory in /src
 * @param scssParts (optional) An array of strings that are names of discrete
 *   SCSS configs inside that application part. If you want to create more than
 *   one final CSS file during a build, create for example the main files
 *   "basic.scss" and "other.scss" somewhere in the source sub directory. The
 *   array parameter would then be [ 'basic', 'other' ] and the resulting CSS
 *   files "basic.css" and "other.css" will arrive in /out/bundle
 */
module.exports = (applicationPart, scssParts) => {
	const webpackConfig = {
		entry: {
			app: path.join(__dirname, 'src', applicationPart, 'index.tsx'),
		},
		output: {
			filename: `${applicationPart}.bundle.js`,
			path: path.join(__dirname, 'out', 'bundle'),
			publicPath: '/static',
		},

		resolve: {
			// Add '.ts' and '.tsx' as resolvable extensions.
			extensions: [
				'.ts',
				'.tsx',
				'.js',
				'.json',
			],
			modules: [
				path.join(__dirname, 'src'),
				'node_modules',
			],
		},

		module: {
			rules: [
				{
					test: /\.tsx?$/,
					// Mind that these loaders get executed in right-to-left order:
					use: [
						BabelLoader,
						TypeScriptLoader,
					],
				},
			],
		},

		plugins: [
			TypeScriptPathsPlugin,
			OrderPlugin,
			new BundleAnalyzerPlugin({
				// Can be `server`, `static` or `disabled`.
				// In `server` mode analyzer will start HTTP server to show
				// bundle report.
				// In `static` mode single HTML file with bundle report will
				// be generated.
				// In `disabled` mode you can use this plugin to just generate
				// Webpack Stats JSON file by setting `generateStatsFile` to `true`.
				analyzerMode: 'static',
				// Host that will be used in `server` mode to start HTTP server.
				analyzerHost: '127.0.0.1',
				// Port that will be used in `server` mode to start HTTP server.
				analyzerPort: 8888,
				// Path to bundle report file that will be generated in `static` mode.
				// Relative to bundles output directory.
				reportFilename: `webpack-report-${applicationPart}.html`,
				// Module sizes to show in report by default.
				// Should be one of `stat`, `parsed` or `gzip`.
				// See "Definitions" section for more information.
				defaultSizes: 'parsed',
				// Automatically open report in default browser
				openAnalyzer: false,
				// If `true`, Webpack Stats JSON file will be generated in bundles
				// output directory
				generateStatsFile: false,
				// Name of Webpack Stats JSON file that will be generated if
				// `generateStatsFile` is `true`.
				// Relative to bundles output directory.
				statsFilename: `webpack-stats-${applicationPart}.json`,
				// Options for `stats.toJson()` method.
				// For example you can exclude sources of your modules from stats file
				// with `source: false` option.
				// See more options here:
				// https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
				statsOptions: null,
				// Log level. Can be 'info', 'warn', 'error' or 'silent'.
				logLevel: 'info',
			}),
		],

		// When importing a module whose path matches one of the following, just
		// assume a corresponding global variable exists and use that instead.
		// This is important because it allows us to avoid bundling all of our
		// dependencies, which allows browsers to cache those libraries between builds.
		externals: {
			'react': 'React',
			'react-dom': 'ReactDOM',
		},
	};

	// Create SASS plugins

	if (scssParts === undefined) {
		// The second parameter to the main function here can be left empty. In this
		// case a default SASS plugin with a target name of 'applicationPart' will
		// be created which takes in all .scss files found in the source folder
		const sassPlugin = new ExtractTextPlugin({
			filename: `${applicationPart}.css`,
		});

		webpackConfig.module.rules.push(createSassModule(sassPlugin, /\.scss$/));
		webpackConfig.plugins.push(sassPlugin);
	}
	else if (isArray(scssParts)) {
		scssParts.forEach((scssName) => {
			const sassPlugin = new ExtractTextPlugin({
				filename: `${scssName}.css`,
			});

			const scssPattern = new RegExp(`${scssName}.scss$`);

			webpackConfig.module.rules.push(createSassModule(sassPlugin, scssPattern));
			webpackConfig.plugins.push(sassPlugin);
		});
	}

	// Enable source maps in development

	if (!isProduction) {
		webpackConfig.devtool = 'source-map';
		/* webpackConfig.module.rules.push({
			enforce: 'pre',
			test: /\.js$/,
			loader: 'source-map-loader'
		}); */
	}

	// Production Plugins

	if (isProduction) {
		webpackConfig.plugins.push(
			UglifyPlugin,
		);
	}

	return webpackConfig;
};
