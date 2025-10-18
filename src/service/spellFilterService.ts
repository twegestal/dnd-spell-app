import { logger } from '../log';
import { gqlRequest } from '../lib/graphqlClient.js';
import {
  SpellsFilteredDocument,
  type SpellsFilteredQuery,
  type SpellsFilteredQueryVariables,
} from '../graphql/__generated__/types';
import type { SpellFilterRequest } from '../types/spells';

function toArray<T>(v: T | T[] | undefined): T[] | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v : [v];
}

export async function fetchSpellsFiltered(input: SpellFilterRequest) {
  const vars: SpellsFilteredQueryVariables = {
    level: toArray(input.level),
    school: toArray(input.school),
    class: toArray(input.class),
    subclass: toArray(input.subclass),
    casting_time: toArray(input.casting_time),
    damage_type: toArray(input.damage_type),
    dc_type: toArray(input.dc_type),
    concentration: input.concentration,
    ritual: input.ritual,
    range: toArray(input.range),
    attack_type: toArray(input.attack_type),
    area_of_effect: input.area_of_effect
      ? {
          size: input.area_of_effect.size
            ? {
                eq: input.area_of_effect.size.eq,
                in: input.area_of_effect.size.in,
                nin: input.area_of_effect.size.nin,
                range: input.area_of_effect.size.range
                  ? {
                      gt: input.area_of_effect.size.range.gt,
                      gte: input.area_of_effect.size.range.gte,
                      lt: input.area_of_effect.size.range.lt,
                      lte: input.area_of_effect.size.range.lte,
                    }
                  : undefined,
              }
            : undefined,
          type: input.area_of_effect.type,
        }
      : undefined,
    limit: input.limit,
    skip: input.skip,
    order: input.order as any,
  };

  const started = Date.now();
  const data = await gqlRequest<
    SpellsFilteredQuery,
    SpellsFilteredQueryVariables
  >(SpellsFilteredDocument, vars);
  const elapsed = Date.now() - started;

  let spells = data.spells ?? [];

  if (input.components?.includesAny || input.components?.includesAll) {
    spells = spells.filter((s) => {
      const comps = s.components ?? [];
      if (input.components?.includesAny) {
        const any = input.components.includesAny.some((c) => comps.includes(c));
        if (!any) return false;
      }
      if (input.components?.includesAll) {
        const all = input.components.includesAll.every((c) =>
          comps.includes(c),
        );
        if (!all) return false;
      }
      return true;
    });
  }

  logger.info('spellFilterService: fetched spells via GraphQL', {
    vars: {
      ...vars,
      area_of_effect: vars.area_of_effect ? '[object]' : undefined,
    },
    count: spells.length,
    ms: elapsed,
  });

  return {
    count: spells.length,
    results: spells.map((s) => ({
      index: s.index,
      name: s.name,
      level: s.level ?? 0,
      url: `/api/spells/${s.index}`,
    })),
  };
}
