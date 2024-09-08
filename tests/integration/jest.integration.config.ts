import type { Config } from '@jest/types';

const jestIntegrationConfig: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../../',
  testMatch: ['<rootDir>/tests/integration/**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    '<rootDir>/src/**/*.(t|j)s',
    '<rootDir>/tests/integration/**/*.(t|j)s',
  ],
  coverageDirectory: '<rootDir>/coverage',
  testEnvironment: 'node',
};

export default jestIntegrationConfig;
