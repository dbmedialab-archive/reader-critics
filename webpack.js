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


const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const mode = process.env.NODE_ENV;

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
		},

		output: {
			filename: '[name].bundle.js',
			path: path.join(__dirname, 'out', 'bundle'),
		},

		mode: mode,

		optimization: {
			minimizer: [
				new UglifyJsPlugin({
					cache: true,
					parallel: true,
					sourceMap: true, // set to true if you want JS source maps
				}),
				new OptimizeCSSAssetsPlugin({}),
			],
		},

		// Enable sourcemaps for debugging webpack's output.
		devtool: 'source-map',

		resolve: {
			// Add '.ts' and '.tsx' as resolvable extensions.
			extensions: ['.ts', '.tsx', '.js', '.json'],
			modules: [path.resolve(__dirname, 'src'), 'node_modules'],
		},

		module: {
			rules: [
				// All files with a '.ts' or '.tsx' extension will be handled
				// by 'awesome-typescript-loader'.
				{
					test: /\.tsx?$/, use: ['babel-loader', 'awesome-typescript-loader'],
				},
				{
					test: /\.scss$/,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader',
						'sass-loader',
					],
				},
				// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
				{ enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
			],
		},

		plugins: [
			new MiniCssExtractPlugin(),
			/*new BundleAnalyzerPlugin({
				// Can be `server`, `static` or `disabled`.
				// In `server` mode analyzer will start HTTP server to show
				// bundle report.
				// In `static` mode single HTML file with bundle report will
				// be generated.
				// In `disabled` mode you can use this plugin to just generate
				// Webpack Stats JSON file by setting `generateStatsFile` to `true`.
				analyzerMode: 'static',
				// Host that will be used in `server` mode to start HTTP server.
				// analyzerHost: '127.0.0.1',
				// Port that will be used in `server` mode to start HTTP server.
				// analyzerPort: 8888,
				// Path to bundle report file that will be generated in `static` mode.
				// Relative to bundles output directory.
				reportFilename: path.join(__dirname, 'stats', `webpack-bundle-analyzer-${applicationPart}.html`),
				// Module sizes to show in report by default.
				// Should be one of `stat`, `parsed` or `gzip`.
				// See "Definitions" section for more information.
				defaultSizes: 'parsed',
				// Automatically open report in default browser
				openAnalyzer: false,
				// If `true`, Webpack Stats JSON file will be generated in bundles
				// output directory
				generateStatsFile: true,
				// Name of Webpack Stats JSON file that will be generated if
				// `generateStatsFile` is `true`.
				// Relative to bundles output directory.
				statsFilename: path.join(__dirname, 'stats', `webpack-bundle-analyzer-${applicationPart}.json`),
				// Options for `stats.toJson()` method.
				// For example you can exclude sources of your modules from stats file
				// with `source: false` option.
				// See more options here:
				// https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
				statsOptions: null,
				// Log level. Can be 'info', 'warn', 'error' or 'silent'.
				logLevel: 'info',
			}),*/

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
	if (scssParts && scssParts.length > 0) {
		scssParts.forEach((item) => {
			const jsEntry = `./src/${applicationPart}/index.tsx`;
			const scssEntry = `./src/${applicationPart}/scss/${item}.scss`;
			if (item === 'fb') {
				webpackConfig.entry[item] = [scssEntry];
			} else {
				webpackConfig.entry[item] = [jsEntry, scssEntry];
			}
		});
	} else {
		const jsEntry = `./src/${applicationPart}/index.tsx`;
		const scssEntry = `./src/${applicationPart}/scss/${applicationPart}.scss`;
		webpackConfig.entry[applicationPart] = [jsEntry, scssEntry];
	}

	return webpackConfig;
};
