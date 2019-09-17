// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
    globals: {
        NODE_ENV: 'test',
        __DEV__: true
    },
    // Indicates whether each individual test should be reported during the run
    verbose: true,
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
    // The directory where Jest should output its   files
    coverageDirectory: 'coverage',
    // The glob patterns Jest uses to detect test files
    testMatch: ['<rootDir>/test/**/*.(js|jsx)'],
    testPathIgnorePatterns: ['<rootDir>/test/index.(js|jsx)', 'node_modules'],
    // An array of directory names to be searched recursively up from the requiring module's location
    moduleDirectories: ['src', 'node_modules'],
    // An array of file extensions your modules use
    moduleFileExtensions: ['js', 'json', 'jsx'],
    // A map from regular expressions to module names that allow to stub out resources with a single module
    moduleNameMapper: {
        '^config(.*)$': '<rootDir>/src/_config$1',
        '^constants(.*)$': '<rootDir>/src/_constants$1',
        '^fonts(.*)$': '<rootDir>/src/_fonts$1',
        '^images(.*)$': '<rootDir>/src/_images$1',
        '^styles(.*)$': '<rootDir>/src/_styles$1',
        '^utils(.*)$': '<rootDir>/src/_utils$1',
        '\\.(css|less|scss)$': 'identity-obj-proxy'
    },
    // A map from regular expressions to paths to transformers
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/fileTransformer.js'
    }
};