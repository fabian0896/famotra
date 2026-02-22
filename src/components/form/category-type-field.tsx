import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { useFieldContext } from '@/hooks/form';

export function CategoryTypeField({ label }: { label: string }) {
  const field = useFieldContext<'expense' | 'income'>();
  return (
    <div>
      <p className="text-xs text-muted-foreground font-medium mb-3">{label}</p>
      <Tabs
        value={field.state.value}
        onValueChange={(v) => field.handleChange(v as 'expense' | 'income')}
      >
        <TabsList>
          <TabsTrigger
            className="data-[state=active]:bg-red-400 data-[state=active]:text-white"
            value="expense"
          >
            <ArrowUpRight className="stroke-3" />
            Gasto
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-green-400 data-[state=active]:text-white"
            value="income"
          >
            <ArrowDownLeft className="stroke-3" />
            Ingreso
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
