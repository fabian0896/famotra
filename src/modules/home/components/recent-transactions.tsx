function TransactionResumeItem() {
  return (
    <li className="p-3.5 flex gap-3.5 items-center">
      <div className="size-11 bg-primary/15 rounded-xl grid place-items-center text-sm ">🚚</div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground mb-0.5">Grocery Store</p>
        <p className="text-xs text-muted-foreground font-normal">Today, 2:30 PM</p>
      </div>
      <div>
        <p className="text-sm font-bold text-red-400">-$130.000</p>
      </div>
    </li>
  );
}

export function RecentTransactions({ className }: React.ComponentProps<'div'>) {
  return (
    <div className={className}>
      <div className="flex justify-between items-center">
        <h6 className="text-xl font-bold text-foreground">Transacciones recientes</h6>
        <button className="text-sm font-medium text-primary hover:underline">Ver todas</button>
      </div>
      <ul className="rounded-2xl bg-card mt-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <TransactionResumeItem key={i} />
        ))}
      </ul>
    </div>
  );
}
