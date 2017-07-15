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

/* eslint-disable prefer-template, quote-props, import/no-extraneous-dependencies */

const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const LodashPlugin = require('lodash-webpack-plugin');

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

// Main config, see other (sometimes environment depending) settings below

module.exports = (applicationPart) => {
	const ExtractSassPlugin = new ExtractTextPlugin({
		filename: applicationPart + '.css',
	});

	const webpackConfig = {
		entry: {
			app: path.join(__dirname, 'src', applicationPart, 'index.tsx'),
		},
		output: {
			filename: applicationPart + '.bundle.js',
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
				{
					test: /\.scss$/,
					use: ExtractSassPlugin.extract({
						use: [{
							loader: 'css-loader?-url',
						}, {
							loader: 'sass-loader',
						}],
						// use style-loader in development
						fallback: 'style-loader',
					}),
				},
			],
		},

		plugins: [
			TypeScriptPathsPlugin,
			OrderPlugin,
			ExtractSassPlugin,
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
