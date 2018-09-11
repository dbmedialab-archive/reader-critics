const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: {
		admin: './src/admin/index.tsx',
		front: './src/front/index.tsx',
	},
	output: {
		path: path.join(__dirname, 'out', 'bundle'),
		filename: '[name].bundle.js',
	},
	mode: 'development',
	// Enable sourcemaps for debugging webpack's output.
	devtool: 'source-map',

	resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: ['.ts', '.tsx', '.js', '.json'],
		modules: [path.resolve(__dirname, 'src'), 'node_modules'],
	},

	module: {
		rules: [
			// All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
			{ test: /\.tsx?$/, use: ['babel-loader', 'awesome-typescript-loader'] },
			{
				test: /\.scss$/,
				use: [{
					loader: 'style-loader',
				}, {
					loader: 'css-loader',
				}, {
					loader: 'sass-loader',
				}],
			},

			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
			{ enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
		],
	},

	// When importing a module whose path matches one of the following, just
	// assume a corresponding global variable exists and use that instead.
	// This is important because it allows us to avoid bundling all of our
	// dependencies, which allows browsers to cache those libraries between builds.
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
	},
};
