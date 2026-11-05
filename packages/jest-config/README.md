# `jest-config`

Configurações compartilhadas do Jest para packages TypeScript/React e aplicações Next.js.

Use `JestBaseConfig` em packages TypeScript, `JestLibraryReactConfig` em bibliotecas React e
`JestNextAppConfig` em aplicações Next.js. A configuração de aplicação inclui jsdom,
`@testing-library/jest-dom`, aliases do monorepo, um mock vazio para o marcador `server-only` e
coleta de cobertura dos fontes sem contar arquivos de teste. O limite global para aplicações Next
é de 80% em branches e 97% em statements, funções e linhas.

```ts
import { JestNextAppConfig } from '@fintech/jest-config';

export default JestNextAppConfig;
```