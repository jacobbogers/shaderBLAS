const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')


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
      sample1: resolve('./src/ex4/sample1.ts'),
      
    },
    module: {
      rules: [
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
      extensions: ['.ts', '.js', '.jpg']
    },
    output: {
      filename: '[name].js',
      path: resolve('./dist')
    },
    plugins: [
      new CleanWebpackPlugin('./dist', cleanOptions)
    ],
    devtool: 'source-map'
  }
  return rc;
}