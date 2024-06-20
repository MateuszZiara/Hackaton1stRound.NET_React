
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['./setupTests.ts'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
        '^.+\\.css$': 'jest-css-modules-transform',
        '^.+\\.(png|jpg|jpeg|gif|webp|svg)$': 'jest-transform-stub',
    },
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'css'], // Ensure 'ts' and 'tsx' are included
    transformIgnorePatterns: ['/node_modules/'],
};
