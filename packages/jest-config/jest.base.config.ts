import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  // Usa o ts-jest como predefinição para compilar TypeScript
  preset: 'ts-jest',
  testMatch: ['**/test/**/*.test.ts', '**/test/**/*.test.tsx'],
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/**/types/**',
    '!src/**/types.ts',
    '!src/**/index.ts',
  ],
  // Ignora a pasta build e node_modules nas transformações
  transformIgnorePatterns: ['/node_modules/'],
};

export default config;
