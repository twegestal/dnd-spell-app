// src/lib/graphqlClient.ts
import { GraphQLClient } from 'graphql-request';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { print, Kind, type DefinitionNode } from 'graphql';
import { logger } from '../log';

const ENDPOINT = 'https://www.dnd5eapi.co/graphql';

const client = new GraphQLClient(ENDPOINT, {
  headers: { 'content-type': 'application/json' },
});

function getOperationName(defs: readonly DefinitionNode[]): string {
  for (const def of defs) {
    if (def.kind === Kind.OPERATION_DEFINITION && def.name)
      return def.name.value;
    if (def.kind === Kind.FRAGMENT_DEFINITION && def.name)
      return def.name.value;
  }
  return 'AnonymousOperation';
}

export async function gqlRequest<
  TData,
  TVars extends Record<string, unknown> = Record<string, never>,
>(
  document: TypedDocumentNode<TData, TVars>,
  variables?: TVars,
): Promise<TData> {
  const query = print(document);
  const opName = getOperationName(document.definitions);

  try {
    const { data } = await client.rawRequest<TData, TVars>(
      query,
      variables as TVars,
    );
    logger.info('GraphQL request OK', { operation: opName });
    return data;
  } catch (err) {
    const anyErr = err as any;
    logger.error('GraphQL request failed', {
      operation: opName,
      message: anyErr?.message ?? String(err),
      status: anyErr?.response?.status,
    });
    throw err;
  }
}
