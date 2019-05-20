const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const NodeExternals = require('webpack-node-externals')

const {
  resolve
} = require('path');

module.exports = env => {

  const random = Math.trunc(Math.random()*1E7)

  const cleanOptions = {
    root: resolve('./dist'),
    verbose: true,
    dry: false
  }

  const rc = {
    mode: 'development',
    entry: {
      //ex1: resolve('./src/ex1/index.ts'),
      //ex2: resolve('./src/ex2/index.ts'),
      //ex4: resolve('./src/ex4/index.ts'),
      ex5: resolve('./src/ex5/index.ts'),
    },
   output: {
    filename: `[name]/${random}-[hash]-bundle.js`,
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
      new CleanWebpackPlugin(['ex1','ex2','ex3','ex4'], cleanOptions),
      new HtmlWebpackPlugin({
        title:'😎🙈 all-the-demos',
        template: resolve('./src/index.template.ejs')
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