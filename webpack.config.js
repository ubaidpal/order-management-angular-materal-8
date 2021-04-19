const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

let sassImplementation;
try {
  // tslint:disable-next-line:no-implicit-dependencies
  sassImplementation = require('node-sass');
} catch {
  sassImplementation = require('sass');
}

module.exports = {
  // Fix for: https://github.com/recharts/recharts/issues/1463
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              syntax: 'postcss-scss',
              plugins: () => [
                require('tailwindcss')
              ]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: sassImplementation,
              sourceMap: false,
              sassOptions: {
                precision: 8
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new webpack.DefinePlugin({
        // global app config object
        config: JSON.stringify({
          //  apiUrl: 'http://localhost/php-api/api' // for testing
             apiUrl: 'http://dev.brightwaygroup.co/auth', // for project,
            // apiDevUrl: 'http://dev.brightwaygroup.co/api',
           
            // for production
         //   apiUrl: '/auth',
            apiDevUrl: '/api',
        })
    }),

    // workaround for warning: Critical dependency: the request of a dependency is an expression
    new webpack.ContextReplacementPlugin(
        /\@angular(\\|\/)core(\\|\/)fesm5/,
        path.resolve(__dirname, 'src')
    )
  ],
  optimization: {
      splitChunks: {
          chunks: 'all',
      },
      runtimeChunk: true
  },
  devServer: {
      historyApiFallback: true
  }
};
