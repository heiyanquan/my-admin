const path = require('path');

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.alias,
      '@': path.resolve(__dirname, 'src'),
      'components': path.resolve('./src/components'),
      'api': path.resolve('./src/api'),
      'assets': path.resolve('./src/assets'),
      'utils': path.resolve('./src/utils'),
      'router': path.resolve('./src/router'),
      'store': path.resolve('./src/store'),
      'views': path.resolve('./src/views'),
      'static': path.resolve('./public/static')
    },
  };

  return config;
};