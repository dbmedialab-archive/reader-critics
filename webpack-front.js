const webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// Loaders

const ldrBabel = {
	loader: 'babel-loader',
	options: {
		presets: ['es2015', 'react'],  // 'stage-1'
	},
};

const ldrTypeScript = {
	loader: 'awesome-typescript-loader',
	options: {
		configFileName: __dirname + '/tsconfig-front.json',
	}
};

const extractSass = new ExtractTextPlugin({
    filename: "[name].css",
    disable: process.env.NODE_ENV === "development"
});

// Main config, see other (sometimes environment depending) settings below

const webpackConfig = {
	entry: {
		app : __dirname + '/src-front/index.tsx'
	},
	output: {
		filename: '[name].bundle.js',
		path: __dirname + '/out/front',
		publicPath: '/static'
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
			{
        test: /\.scss$/,
        use: extractSass.extract({
          use: [{
	            loader: "css-loader"
	          }, {
	            loader: "sass-loader"
          }],
          // use style-loader in development
          fallback: "style-loader"
        })
      }
		],
	},

	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
		extractSass
	],

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
	/* webpackConfig.module.rules.push({
		enforce: 'pre',
		test: /\.js$/,
		loader: 'source-map-loader'
	}); */
}


// Production settings
if (isProduction) {
	webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

// All good
module.exports = webpackConfig;
