import { JestLibraryReactConfig } from '@fintech/jest-config';
import type { Config } from 'jest';

const config: Config = {
  ...JestLibraryReactConfig,
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
};

export default config;
