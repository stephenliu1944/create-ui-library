var vars = require('postcss-simple-vars');
var autoprefixer = require('autoprefixer');
var nested = require('postcss-nested');

module.exports = {
    plugins: [
        vars,
        autoprefixer,
        nested()
    ]
};