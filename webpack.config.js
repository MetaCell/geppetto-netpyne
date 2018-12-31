var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
//var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var geppettoConfig;
try {
    geppettoConfig = require('./GeppettoConfiguration.json');
    console.log('\nLoaded Geppetto config from file');
} catch (e) {
    // Failed to load config file
    console.error('\nFailed to load Geppetto Configuration')
}

var publicPath = ((geppettoConfig.contextPath == '/') ? geppettoConfig.contextPath : "/" + geppettoConfig.contextPath + "/") + "geppetto/build/";
console.log("\nThe public path (used by the main bundle when including split bundles) is: " + publicPath);

// Get available theme
var availableTheme = "";
for (var theme in geppettoConfig.themes) {
    if (geppettoConfig.themes[theme]) {
        availableTheme = theme;
    }
}
console.log("\nEnable theme:");
console.log(availableTheme);

var isProduction = process.argv.indexOf('-p') >= 0;
console.log("\n Building for a " + ((isProduction) ? "production" : "development") + " environment")

const availableExtensions = [
  { from: "node_modules/webapp/static/*", to: 'static', flatten: true },
  { from: "static/*", to: 'static', flatten: true },
];

module.exports = function(env){

	if(env!=undefined){
		console.log(env);
		if(env.contextPath){
			geppettoConfig.contextPath=env.contextPath;
		}
		if(env.useSsl){
			geppettoConfig.useSsl= JSON.parse(env.useSsl);
		}
		if(env.noTest){
			geppettoConfig.noTest= JSON.parse(env.noTest);
		}
		if(env.embedded){
			geppettoConfig.embedded= JSON.parse(env.embedded);
		}
		if(env.embedderURL){
			geppettoConfig.embedderURL=env.embedderURL;
		}
	}
	
	console.log('Geppetto configuration \n');
	console.log(JSON.stringify(geppettoConfig, null, 2), '\n');
  
	var entries = {
        main: path.resolve(__dirname, "ComponentsInitialization.js"),
        admin: path.resolve(__dirname, "node_modules/webapp/js/pages/admin/admin.js"),
	};

	console.log("\nThe Webpack entries are:");
	console.log(entries);

    return {
	    entry: entries,
	  
	    output: {
	        path: path.resolve(__dirname, 'build'),
	        filename: '[name].bundle.js',
	        publicPath: publicPath
	    },
	    plugins: [
	        // new BundleAnalyzerPlugin({
	        //     analyzerMode: 'static'
	        // }),
		    new webpack.optimize.CommonsChunkPlugin(['common']),
	        new CopyWebpackPlugin(availableExtensions),
	        new HtmlWebpackPlugin({
	            filename: 'geppetto.vm',
	            template: path.resolve(__dirname, 'node_modules/webapp/js/pages/geppetto/geppetto.ejs'),
	            GEPPETTO_CONFIGURATION: geppettoConfig,
	            // chunks: ['main'] Not specifying the chunk since its not possible
				// yet (need to go to Webpack2) to specify UTF-8 as charset without
				// which we have errors
	            chunks: []
	        }),
	        new HtmlWebpackPlugin({
	            filename: 'admin.vm',
	            template: path.resolve(__dirname, 'node_modules/webapp/js/pages/admin/admin.ejs'),
	            // chunks: ['admin'] Not specifying the chunk since its not possible
				// yet (need to go to Webpack2) to specify UTF-8 as charset without
				// which we have errors
	            chunks: []
	        }),
	        new HtmlWebpackPlugin({
	            filename: 'dashboard.vm',
	            template: path.resolve(__dirname, 'node_modules/webapp/js/pages/dashboard/dashboard.ejs'),
	            GEPPETTO_CONFIGURATION: geppettoConfig,
	            chunks: []
	        }),
	        new HtmlWebpackPlugin({
	            filename: '../WEB-INF/web.xml',
	            template: path.resolve(__dirname, 'node_modules/webapp/WEB-INF/web.ejs'),
	            GEPPETTO_CONFIGURATION: geppettoConfig,
	            chunks: []
	        }),
	        new webpack.DefinePlugin({
	            'process.env': {
	                'NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
              }
	        }),
	        new ExtractTextPlugin("[name].css"),
	    ],
	
	    resolve: {
	        alias: {
              webapp: path.resolve(__dirname, 'node_modules/webapp'),
	            geppetto: path.resolve(__dirname, 'node_modules/webapp/js/pages/geppetto/GEPPETTO.js'),
	            handlebars: 'handlebars/dist/handlebars.js'
	
          },
          // symlinks: true,
          modules: [
            path.resolve(__dirname, 'node_modules/webapp/node_modules'), 
            'node_modules'
          ],
	        extensions: ['*', '.js', '.json'],
	    },
	
	    module: {
	        rules: [
	            {
	                test: /\.(js|jsx)$/,
                  exclude: [/ami.min.js/, /node_modules/],
	                loader: 'babel-loader',
	                query: {
	                    presets: [['babel-preset-env', { "modules": false }], 'stage-2', 'react']
	                }
	            },
	            {
	                test: /Dockerfile/,
	                loader: 'ignore-loader'
	            },
	            {
	                test: /\.(py|jpeg|svg|gif|css|jpg|md|hbs|dcm|gz|xmi|dzi|sh|obj|yml|nii)$/,
	                loader: 'ignore-loader'
	            },
	            {
	                test: /\.(png|eot|ttf|woff|woff2|svg)(\?[a-z0-9=.]+)?$/,
	                loader: 'url-loader?limit=100000'
	            },
	            {
	                
                  test: /\.css$/,
	                use: ExtractTextPlugin.extract({
	                  fallback: "style-loader",
	                  use: "css-loader"
	                })
	                  
	            },
	            {
                  test: /\.less$/,
                  loader: 'style-loader!css-loader!less-loader?{"modifyVars":{"url":"\'' + path.resolve(__dirname, 'css/colors') + '\'"}}'
	            },
	            {
	                test: /\.html$/,
	                loader: 'raw-loader'
	            }
	        ]
	    },
	    node: {
	        fs: 'empty',
	        child_process: 'empty',
	        module: 'empty'
	    }
    }
};
