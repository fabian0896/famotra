import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';

export function useAvatar(seed = '') {
  const avatar = useMemo(() => {
    return createAvatar(initials, { seed }).toDataUri();
  }, [seed]);
  return { avatar };
}
