/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: [
      './tests'
    ],
    moduleDirectories: [
      'node_modules',
      'src'
    ],
    moduleNameMapper: {
      "@libs/(.*)": "<rootDir>/src/libs/$1",
      "@functions/(.*)": "<rootDir>/src/functions/$1",
      "@src/(.*)": "<rootDir>/src/$1"
    },
  };
  