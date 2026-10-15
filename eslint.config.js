const expo = require('eslint-config-expo/flat');

module.exports = [...expo, { ignores: ['node_modules/', 'android/', 'ios/', 'dist/'] }];
