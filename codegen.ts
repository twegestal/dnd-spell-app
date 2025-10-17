import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://www.dnd5eapi.co/graphql',
  documents: 'src/graphql/**/*.graphql',
  generates: {
    'src/graphql/__generated__/types.ts': {
      plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
      config: {
        maybeValue: 'T | null | undefined',
      },
    },
  },
};

export default config;
