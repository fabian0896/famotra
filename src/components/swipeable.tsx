import React, { createContext, useContext, useRef, useState } from 'react';
import { useDrag } from '@use-gesture/react';
import { Slot } from '@radix-ui/react-slot';
import type { ElementType } from 'react';
import { cn } from '@/lib/utils';

type SwipeableContextType = {
  translate: number;
  isDragging: boolean;
  actionsRef: React.RefObject<HTMLDivElement | null>;
  bind: ReturnType<typeof useDrag>;
  close: () => void;
};

const SwipeableContext = createContext<SwipeableContextType | null>(null);

function useSwipeable() {
  const ctx = useContext(SwipeableContext);
  if (!ctx) throw new Error('Swipeable compound components must be used inside <Swipeable>');
  return ctx;
}

function SwipeableRoot<T extends ElementType = 'div'>({
  children,
  as,
}: {
  children: React.ReactNode;
  as?: T;
}) {
  const [{ translate, dragging }, set] = useState({ translate: 0, dragging: false });
  const actionsRef = useRef<HTMLDivElement>(null);
  const translateRef = useRef(translate);
  translateRef.current = translate;
  const gestureStartTranslate = useRef(0);

  const close = () => set({ translate: 0, dragging: false });

  const bind = useDrag(
    ({ movement: [mx], active, first, last, velocity: [vx], direction: [dx] }) => {
      if (first) {
        gestureStartTranslate.current = translateRef.current;
      }
      const actionsWidth = actionsRef.current?.offsetWidth ?? 0;
      const absolute = gestureStartTranslate.current + mx;
      const clamped = Math.min(0, Math.max(absolute, -actionsWidth));

      if (last) {
        const shouldOpen = dx <= 0 && (clamped < -(actionsWidth / 3) || vx > 0.5);
        set({ translate: shouldOpen ? -actionsWidth : 0, dragging: false });
      } else {
        set({ translate: clamped, dragging: active });
      }
    },
    { axis: 'x', filterTaps: true }
  );

  const Comp = as ?? 'div';

  return (
    <SwipeableContext.Provider value={{ translate, isDragging: dragging, actionsRef, bind, close }}>
      <Comp className="relative overflow-hidden block">{children}</Comp>
    </SwipeableContext.Provider>
  );
}

function SwipeableItem({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}) {
  const { translate, isDragging, bind, close } = useSwipeable();

  return (
    <Slot
      {...bind()}
      data-dragging={isDragging || translate !== 0}
      className="relative z-10 touch-pan-y"
      style={{
        transform: `translateX(${translate}px)`,
        transition: isDragging ? 'none' : 'transform 200ms ease',
      }}
      onClick={(event) => {
        if (translate !== 0) {
          close();
        }
        onClick?.(event);
      }}
    >
      {children}
    </Slot>
  );
}

function SwipeableActions({ children }: { children: React.ReactNode }) {
  const { actionsRef, translate, isDragging } = useSwipeable();

  const actionsWidth = actionsRef.current?.offsetWidth ?? 0;
  const opacity = translate === 0 ? 0 : (1 / -(0.5 * actionsWidth)) * translate;

  return (
    <div
      ref={actionsRef}
      style={{
        opacity: opacity,
        transition: isDragging ? 'none' : 'opacity 200ms ease',
      }}
      className="absolute right-0 top-0 flex h-full"
    >
      {children}
    </div>
  );
}

function SwipeableAction({
  children,
  onClick,
  className,
  asChild,
}: {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : 'button';
  const { close } = useSwipeable();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    close();
  };

  return (
    <Comp
      className={cn('flex h-full flex-col items-center justify-center w-[70px]', className)}
      onClick={handleClick}
    >
      {children}
    </Comp>
  );
}

export const Swipeable = Object.assign(SwipeableRoot, {
  Item: SwipeableItem,
  Actions: SwipeableActions,
  Action: SwipeableAction,
});
