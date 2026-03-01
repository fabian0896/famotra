import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

import { cn } from '@/lib/utils';

// Replaces vaul (unmaintained, broken touch events on iOS PWA) with
// @radix-ui/react-dialog styled as a bottom sheet. Same exported API.

function useDragToClose(closeRef: React.RefObject<HTMLButtonElement | null>) {
  const [dragOffset, setDragOffset] = React.useState(0);
  const [isDragClosing, setIsDragClosing] = React.useState(false);
  const startY = React.useRef(0);
  const CLOSE_THRESHOLD = 100;

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragClosing) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    startY.current = e.clientY;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    setDragOffset(Math.max(0, e.clientY - startY.current));
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (dragOffset >= CLOSE_THRESHOLD) {
      setIsDragClosing(true);
      setDragOffset(window.innerHeight);
      setTimeout(() => {
        closeRef.current?.click();
        requestAnimationFrame(() => {
          setIsDragClosing(false);
          setDragOffset(0);
        });
      }, 250);
    } else {
      setDragOffset(0);
    }
  };

  const style: React.CSSProperties | undefined = isDragClosing
    ? { transform: `translateY(${dragOffset}px)`, transition: 'transform 0.25s ease' }
    : dragOffset > 0
    ? { transform: `translateY(${dragOffset}px)`, transition: 'none' }
    : undefined;

  const handleProps = { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp };

  return { style, isDragClosing, handleProps };
}

function Drawer({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-black/50',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className
      )}
      {...props}
    />
  );
}

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const { style, isDragClosing, handleProps } = useDragToClose(closeRef);

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DialogPrimitive.Content
        data-slot="drawer-content"
        onOpenAutoFocus={(e) => e.preventDefault()}
        style={style}
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 flex flex-col bg-card rounded-t-3xl max-h-[80vh]',
          'data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=open]:duration-300',
          !isDragClosing &&
            'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=closed]:duration-200',
          className
        )}
        {...props}
      >
        <div className="py-3 flex justify-center touch-none cursor-grab active:cursor-grabbing" {...handleProps}>
          <div className="bg-border h-1 w-10 rounded-full" />
        </div>
        {children}
        <DialogPrimitive.Close ref={closeRef} className="sr-only" aria-hidden tabIndex={-1} />
      </DialogPrimitive.Content>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-header"
      className={cn('flex flex-col gap-0.5 p-4 text-center', className)}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  );
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="drawer-title"
      className={cn('text-foreground font-semibold', className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="drawer-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
