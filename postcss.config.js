var autoprefixer = require('autoprefixer');
var vars = require('postcss-simple-vars');
var nested = require('postcss-nested');

module.exports = {
    plugins: [
        autoprefixer,
        vars,
        nested()
    ]
};