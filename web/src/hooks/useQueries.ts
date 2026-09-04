import {
  type QueryFunction,
  type QueryKey,
  type UseQueryResult,
  type UseSuspenseQueryResult,
  useQuery,
  useSuspenseQueries,
  useSuspenseQuery,
} from '@tanstack/react-query';

const options = { retry: false, refetchOnWindowFocus: false };

export const useQueryDefault = <T>(queryKey: string[], queryFn: QueryFunction<T>): UseQueryResult<T, unknown> => {
  return useQuery({ queryKey, queryFn, ...options });
};

export const useQueryWithSuspense = <T>(
  queryKey: string[],
  queryFn: QueryFunction<T>,
): UseSuspenseQueryResult<T, unknown> => {
  return useSuspenseQuery({ queryKey, queryFn, ...options });
};

export const useQueriesWithSuspense = <T>(
  queries: { queryKey: QueryKey; fetcher: QueryFunction<T> }[],
): UseSuspenseQueryResult<T, unknown>[] => {
  return useSuspenseQueries({
    queries: queries.map(({ queryKey, fetcher }) => ({ queryKey, queryFn: fetcher, ...options })),
  });
};
