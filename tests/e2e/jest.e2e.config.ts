import type { Config } from '@jest/types';

const jestE2EConfig: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../../',
  testMatch: ['<rootDir>/tests/e2e/**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    '<rootDir>/src/**/*.(t|j)s',
    '<rootDir>/tests/e2e/**/*.(t|j)s',
  ],
  coverageDirectory: '<rootDir>/coverage',
  testEnvironment: 'node',
};

export default jestE2EConfig;
