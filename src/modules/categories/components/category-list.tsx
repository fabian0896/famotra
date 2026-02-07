import { useAutoAnimate } from '@formkit/auto-animate/react';

export function CategoryList({
  children,
  title,
  description,
  ...props
}: { title: string; description: string } & React.ComponentProps<'div'>) {
  const [parent] = useAutoAnimate();
  return (
    <div {...props}>
      <div className="mb-4">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ul
        ref={parent}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-5"
      >
        {children}
      </ul>
    </div>
  );
}
