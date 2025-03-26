// webpack.config.js
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function (options, webpack) {
  return {
    ...options,
    plugins: [
      ...options.plugins,
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src/templates'),
            to: path.resolve(__dirname, 'dist/templates'),
          },
        ],
      }),
    ],
  };
};
