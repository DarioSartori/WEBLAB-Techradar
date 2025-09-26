import type { Config } from 'jest';

const common = {
  moduleFileExtensions: ['ts', 'js', 'json'],
  testEnvironment: 'node',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

const config: Config = {
  globalSetup: '<rootDir>/test/integration/global-setup.ts',
  projects: [
    {
      displayName: 'unit',
      rootDir: '.',
      ...common,
      testMatch: [
        '<rootDir>/src/**/*.spec.ts',
        '<rootDir>/test/unit/**/*.spec.ts',
      ],
      testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/test/e2e/',
        '/test/integration/',
      ],
      setupFilesAfterEnv: ['<rootDir>/test/setup-unit.ts'],
    },
    {
      displayName: 'e2e',
      rootDir: '.',
      ...common,
      testMatch: ['<rootDir>/test/e2e/**/*.e2e-spec.ts'],
      setupFilesAfterEnv: ['<rootDir>/test/setup-e2e.ts'],
    },
    {
      displayName: 'integration',
      rootDir: '.',
      ...common,
      testMatch: ['<rootDir>/test/integration/**/*.spec.ts'],
      setupFilesAfterEnv: ['<rootDir>/test/integration/setup.ts'],
    },
  ],
};

export default config;
