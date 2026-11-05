import type { Config } from 'jest';
import * as path from 'path';
import { fileURLToPath } from 'url';

import baseConfig from './jest.base.config.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const setupFile = path.resolve(__dirname, 'jest.react-setup.ts');

const config: Config = {
  ...baseConfig,
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    ...(baseConfig.collectCoverageFrom ?? []),
    '!src/**/test/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 97,
      lines: 97,
      statements: 97,
    },
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^server-only$': '<rootDir>/../../packages/jest-config/jest.server-only.mock.ts',
    '^@/src/(.*)$': '<rootDir>/src/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
    '^@fintech/shared$': '<rootDir>/../../packages/shared/src/index.ts',
    '^@fintech/ui$': '<rootDir>/../../packages/ui/src/index.ts',
  },
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
  setupFilesAfterEnv: [setupFile],
};

export default config;
