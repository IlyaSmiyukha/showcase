module.exports = {
  verbose: true,
  clearMocks: true,
  collectCoverage: true,
  setupFilesAfterEnv: [
    '<rootDir>/config/testConfig.js'
  ],
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '\\.(jpg|jpeg|png|gif|svg|woff|woff2|less|css)$': "<rootDir>/src/tests/__mocks/staticMock.js"
  },
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
  },
};
