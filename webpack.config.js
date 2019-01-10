const CleanWebpackPlugin = require('clean-webpack-plugin');

const {
  resolve
} = require('path');

module.exports = env => {

  const cleanOptions = {
    root: resolve('.'),
    verbose: true,
    dry: false
  }

  const rc = {
    mode: 'development',
    entry: {
      sample1: resolve('./sample1.ts'),
      sample2: resolve('./sample2.ts')
    },
    module: {
      rules: [{
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }]
    },
    resolve: {
      extensions: ['.ts','.js']
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