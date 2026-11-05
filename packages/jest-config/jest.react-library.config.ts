import type { Config } from 'jest';
import * as path from 'path';
import { fileURLToPath } from 'url';

import baseConfig from './jest.base.config.ts'

// Cria o equivalente ao __dirname de forma segura para ambientes ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupFile = path.resolve(__dirname, 'jest.react-setup.ts');

const config: Config = {
  ...baseConfig,
  // Define jsdom para simular o navegador no ambiente Node
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Trata arquivos CSS/SCSS para não quebrarem o Jest
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Caso use caminhos absolutos no Vite/TsConfig (ex: '@/components/...')
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@fintech/(.*)$': '<rootDir>/../$1/src'
  },
  // Executa scripts de configuração antes de rodar os testes
  setupFilesAfterEnv: [setupFile],

};

export default config;
