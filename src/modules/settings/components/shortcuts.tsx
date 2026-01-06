import { TokenTable } from './token-table';

export function Shortcuts() {
  return (
    <div>
      <div>
        <div className="mb-6">
          <h3 className="text-foreground text-xl font-medium">Publishable key</h3>
          <p className="text-sm text-muted-foreground max-w-2xl mt-1">
            This key is safe to use in a browser if you have enabled Row Level Security (RLS) for
            your tables and configured policies.
          </p>
        </div>
        <TokenTable />
      </div>
    </div>
  );
}
