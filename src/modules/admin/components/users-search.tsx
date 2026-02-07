import { useEffect, useRef, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface UsersSearchProps {
  onSearch: (value: string) => void;
}

export function UsersSearch({ onSearch }: UsersSearchProps) {
  const [value, setValue] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onSearch(value);
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, onSearch]);

  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        placeholder="Buscar por nombre o correo..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}
