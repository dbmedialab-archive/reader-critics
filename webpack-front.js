const webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';

// Loaders

const ldrBabel = {
	loader: 'babel-loader',
	options: {
		presets: ['es2015', 'stage-1'],
	},
};

const ldrTypeScript = {
	loader: 'awesome-typescript-loader',
	options: {
		configFileName: __dirname + '/tsconfig-front.json',
	}
};

// Main config, see other (sometimes environment depending) settings below

const webpackConfig = {
	entry: __dirname + '/src-front/index.tsx',
	output: {
		filename: 'bundle.js',
		path: __dirname + '/out/front'
	},

	resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: [
			'.ts',
			'.tsx',
			'.js',
			'.json',
		],
	},

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				// Mind that these loaders get executed in right-to-left order:
				use: [
					ldrBabel,
					ldrTypeScript,
				],
			},
		],
	},

	// When importing a module whose path matches one of the following, just
	// assume a corresponding global variable exists and use that instead.
	// This is important because it allows us to avoid bundling all of our
	// dependencies, which allows browsers to cache those libraries between builds.
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM'
	},
};

// Enable source maps in development

if (!isProduction) {
	// Source maps
	webpackConfig.devtool = 'source-map';
	webpackConfig.module.rules.push({
		enforce: 'pre',
		test: /\.js$/,
		loader: 'source-map-loader'
	});
}

// Plugins

const plugins = [
	new webpack.optimize.OccurrenceOrderPlugin(),
];

if (isProduction) {
	plugins.push(new webpack.optimize.UglifyJsPlugin());
}

webpackConfig.plugins = plugins;

// All good

module.exports = webpackConfig;
