module.exports = {
    testEnvironment: 'node',
    // setupFilesAfterEnv: ['./tests/setup.js'],
    testMatch: ['**/tests/**/*.test.js'],
    collectCoverageFrom: [
        'controllers/**/*.js',
        'services/**/*.js',
        '!**/node_modules/**',
    ],
};