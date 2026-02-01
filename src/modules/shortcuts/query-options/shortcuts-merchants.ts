import { queryOptions } from '@tanstack/react-query';
import { ShortcutsMerchantService } from '../services/shortcuts-merchants';
import { QueryKeys } from '@/constants/query-keys';

export const shortcutsMerchantsQueryOptions = queryOptions({
  queryKey: [QueryKeys.SHORTCUTS_MERCHANTS],
  queryFn: () => ShortcutsMerchantService.get(),
  staleTime: Infinity,
});
