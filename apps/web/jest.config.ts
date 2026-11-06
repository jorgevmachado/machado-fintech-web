import { JestNextAppConfig } from '@fintech/jest-config';

export default {
  ...JestNextAppConfig,
  moduleNameMapper: {
    ...JestNextAppConfig.moduleNameMapper,
    '^@fintech/(.*)$': '<rootDir>/../../packages/$1/src',
  },
};
