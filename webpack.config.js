const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const NodeExternals = require('webpack-node-externals')

const {
  resolve
} = require('path');

module.exports = env => {

  const cleanOptions = {
    root: resolve('./dist'),
    verbose: true,
    dry: false
  }

  const rc = {
    mode: 'development',
    entry: {
      ex1: resolve('./src/ex1/index.ts'),
      ex2: resolve('./src/ex2/index.ts'),
      ex3: resolve('./src/ex3/index.ts'),
    },
   output: {
    filename: '[name]/bundle.js',
    path: resolve('./dist')
  },
    module: {
      rules: [
        {
          test:/\.glsl$/,
          use:'raw-loader'
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [{
            loader: 'file-loader',
            options: {
              name(file) {
                if (process.env.NODE_ENV === 'development') {
                  return '[path][name].[ext]';
                }
                return '[hash].[ext]';
              },
            },
          }], // use
        },
      ]
    },
  
    resolve: {
      extensions: ['.ts', '.js', '.jpg','.glsl']
    },
    plugins: [
      new CleanWebpackPlugin('./dist', cleanOptions),
      new HtmlWebpackPlugin({
        title:'all-the-demos',
        template: resolve('./src/_index.html')
      }),
    ],
    devtool: 'source-map',
    externals:[
      NodeExternals({
        whitelist:['debug','ms','twgl.js']
      })
    ]
  }
  return rc;
}