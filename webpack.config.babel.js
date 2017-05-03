import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import SWPrecacheWebpackPlugin from 'sw-precache-webpack-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
const ENV = process.env.NODE_ENV || 'development';
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: './src/index.js',

	output: {
		path: './build',
		publicPath: '',
		filename: 'bundle.js'
	},

	resolve: {
		extensions: ['', '.jsx', '.js', '.json', '.less']
	},

	module: {
		preLoaders: [
			{
				test: /\.jsx?$/,
				exclude: /src\//,
				loader: 'source-map'
			}
		],
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel'
			},
			{
				test: /\.(less|css)$/,
				loader: ExtractTextPlugin.extract('css?sourceMap!postcss!less?sourceMap')
			},
			{
				test: /\.json$/,
				loader: 'json'
			},
			{
				test: /\.(xml|html|txt)$/,
				loader: 'raw'
			},
			{
				test: /\.(svg|woff|ttf|eot)(\?.*)?$/i,
				loader: 'file-loader?name=assets/fonts/[name]_[hash:base64:5].[ext]'
			}
		]
	},

	postcss: () => [
		autoprefixer({ browsers: 'last 2 versions' })
	],

	plugins: ([
		new webpack.NoErrorsPlugin(),
		new ExtractTextPlugin('style.css', { allChunks: true }),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(ENV)
		}),
		new HtmlWebpackPlugin({
			template: 'src/index.template.html'
		})
	]).concat(ENV === 'production' ? [
		new FaviconsWebpackPlugin({
			logo: './src/assets/spiro-logo.png',
			prefix: 'icons/',
			// Generate a cache file with control hashes and
			// don't rebuild the favicons until those hashes change
			persistentCache: true,
			// Inject the html into the html-webpack-plugin
			inject: true,
			// favicon background color (see https://github.com/haydenbleasel/favicons#usage)
			background: '#fff',
			// favicon app title (see https://github.com/haydenbleasel/favicons#usage)
			title: 'Spiro3D',
			icons: {
				android: true,
				appleIcon: true,
				appleStartup: true,
				coast: true,
				favicons: true,
				firefox: true,
				opengraph: false,
				twitter: false,
				yandex: false,
				windows: true
			}
		}),
			new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new SWPrecacheWebpackPlugin(
			{
				cacheId: 'Spiro3D',
				filename: 'spiro3D_SW.js',
				maximumFileSizeToCacheInBytes: 4194304,
				minify: true,
				runtimeCaching: [{
					handler: 'cacheFirst',
					urlPattern: /[.]mp3$/,
				}],
			}
		),
	] : []),

	stats: { colors: true },

	devtool: ENV === 'production' ? 'source-map' : 'inline-source-map',

	devServer: {
		port: process.env.PORT || 8080,
		host: '0.0.0.0',
		colors: true,
		publicPath: '/',
		contentBase: './src',
		historyApiFallback: true,
		proxy: [
			// OPTIONAL: proxy configuration:
			// {
			// 	path: '/optional-prefix/**',
			// 	target: 'http://target-host.com',
			// 	rewrite: req => { req.url = req.url.replace(/^\/[^\/]+\//, ''); }   // strip first path segment
			// }
		]
	}
};
