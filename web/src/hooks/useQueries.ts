/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import { type QueryFunction, type QueryKey, type UseQueryResult, useQueries, useQuery } from '@tanstack/react-query';

type RequireData<T extends { data: unknown }> = T & {
  data: NonNullable<T['data']>;
};
type UseQueryWithSuspenseResult<T> = RequireData<UseQueryResult<T, unknown>>;

const options = { suspense: true, retry: false, refetchOnWindowFocus: false };

export const useQueryWithSuspense = <T>(
  queryKey: string[],
  queryFn: QueryFunction<T>,
): UseQueryWithSuspenseResult<T> => {
  return useQuery({ queryKey: queryKey, queryFn: queryFn, ...options }) as any;
};

export const useQueriesWithSuspense = <T>(
  queries: { queryKey: QueryKey; fetcher: QueryFunction<T> }[],
): UseQueryWithSuspenseResult<T>[] => {
  const queriesWithOptions = queries.map(({ queryKey, fetcher }) => ({
    queryKey,
    queryFn: fetcher,
    ...options,
  }));
  return useQueries({ queries: queriesWithOptions }) as any[];
};
