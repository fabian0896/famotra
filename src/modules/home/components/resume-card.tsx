import { ArrowDownLeftIcon, ArrowUpRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ResumeCard({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5 p-6 rounded-3xl bg-linear-to-br from-[#6366F1] via-[#4F46E5] to-[#E85A4F]',
        className
      )}
      {...props}
    >
      <div className="flex justify-between items-center">
        <h6 className="text-white text-sm font-medium">Total balance</h6>
        <p className="font-mono text-sm text-white/70 tracking-wider">ENERO 2026</p>
      </div>
      <p className="text-white text-4xl font-bold tracking-tight leading-tight">$120.580</p>
      <div className="flex gap-6">
        <div className="flex gap-2 items-center">
          <div className="size-7 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowDownLeftIcon className="text-white size-3.5 stroke-3" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-white/70 mb-0.5">Income</p>
            <p className="text-sm font-bold text-white">$850.000</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="size-7 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowUpRightIcon className="text-white size-3.5 stroke-3" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-white/70 mb-0.5">Expenses</p>
            <p className="text-sm font-bold text-white">$850.000</p>
          </div>
        </div>
      </div>
    </div>
  );
}
