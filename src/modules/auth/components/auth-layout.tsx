import famotraLogo from '../../../../public/famotra-logo.png';

export function AuthLayout({
  children,
  title = 'Famotra',
  description,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-center p-8 min-h-screen">
      <div className="space-y-6 max-w-sm w-full">
        <div className="text-center">
          <div className="size-[72px] bg-primary rounded-2xl mb-6 mx-auto overflow-hidden">
            <img className="w-full h-full" src={famotraLogo} alt="famotra logo" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
          {description && <p className="text-muted-foreground text-base">{description}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
