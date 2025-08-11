import { useQuery } from '@tanstack/react-query';
import { booksApi } from '../api';
import { FilterState, Book, SearchParams } from '../types';

export interface UseBooksOptions {
  filters: FilterState;
  enabled?: boolean;
}

function buildSearchParams(filters: FilterState): SearchParams {
  return {
    query: filters.searchQuery || undefined,
    domainTags: filters.selectedDomainTags.length ? filters.selectedDomainTags : undefined,
    themeTags: filters.selectedThemeTags.length ? filters.selectedThemeTags : undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder
  };
}

export const useBooks = ({ filters, enabled = true }: UseBooksOptions) => {
  const params = buildSearchParams(filters);
  return useQuery<Book[], Error>({
    queryKey: ['books', params],
    queryFn: () => booksApi.getBooks(params),
    enabled,
    staleTime: 1000 * 30, // 30s 认为新鲜
    keepPreviousData: true,
  });
};

export default useBooks;
