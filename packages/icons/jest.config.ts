import { JestLibraryReactConfig } from '@fintech/jest-config';
import type { Config } from 'jest';

const config: Config = {
    ...JestLibraryReactConfig,
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: { rootDir: '.' } }],
    },
};

export default config;
