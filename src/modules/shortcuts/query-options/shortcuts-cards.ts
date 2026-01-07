import { queryOptions } from '@tanstack/react-query';
import { ShortcutsCardService } from '../services/shortcuts-cards';
import { QueryKeys } from '@/constants/query-keys';

export const shortcutsCardsQueryOptions = queryOptions({
  queryKey: [QueryKeys.SHORTCUTS_CARDS],
  queryFn: () => ShortcutsCardService.get(),
  staleTime: Infinity,
});
