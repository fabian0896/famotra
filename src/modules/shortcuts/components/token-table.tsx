import { CheckIcon, CopyIcon, EyeIcon, EyeOffIcon, KeyIcon, Plus, Trash2Icon } from 'lucide-react';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import React, { useState } from 'react';
import { tokensQueryOptions } from '../query-options/tokens';
import { TokenService } from '../services/tokens';
import { CreateTokenDialog } from './create-token-dialog';
import type { Token } from '../models/tokens.model';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatError } from '@/lib/format-error';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Swipeable } from '@/components/swipeable';

function ActionButton({
  children,
  tooltip,
  ...props
}: { children: React.ReactNode; tooltip: string } & React.ComponentProps<'button'>) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          {...props}
          className="px-2 py-1 h-[26px] rounded-full text-foreground border bg-muted transition-all cursor-pointer hover:border-foreground"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function CopyButton({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2_000);
  };

  return (
    <ActionButton disabled={copied} onClick={copyToClipboard} tooltip="Copiar token">
      {copied ? (
        <CheckIcon className="text-emerald-400" size={14} />
      ) : (
        <CopyIcon className="text-foreground" size={14} />
      )}
    </ActionButton>
  );
}

function HideButtton({
  hide,
  onHideChange,
}: {
  hide: boolean;
  onHideChange: (hide: boolean) => void;
}) {
  const tooltip = hide ? 'Mostrar token' : 'Ocultar token';
  return (
    <ActionButton onClick={() => onHideChange(!hide)} tooltip={tooltip}>
      {hide ? <EyeIcon size={14} /> : <EyeOffIcon size={14} />}
    </ActionButton>
  );
}

function SecretValue({ children, hide }: { children: string; hide: boolean }) {
  const value = React.useMemo(() => {
    if (!hide) return children;
    const parts = children.split('_');
    const prefix = parts[0];
    const token = parts.slice(1).join('_');
    const visiblePart = token.slice(0, 5);
    const hiddenPart = '••••••••••••••••••';
    return `${prefix}_${visiblePart}${hiddenPart}`;
  }, [children, hide]);
  return value;
}

function TokenRow({ token }: { token: Token }) {
  const [hideToken, setHideToken] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: TokenService.remove,
    onMutate: (variants) => {
      const tokens = queryClient.getQueryData<Token[]>(tokensQueryOptions.queryKey);
      const idx = tokens?.findIndex((t) => t.id === variants.id);
      if (idx === -1) return token;
      const newData = queryClient.setQueryData<Token[]>(tokensQueryOptions.queryKey, (data) => {
        if (!data) return data;
        const newList = [...data];
        newList.splice(idx!, 1);
        return newList;
      });
      return newData;
    },
    onError: (error) => {
      const { message } = formatError(error);
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tokensQueryOptions.queryKey });
    },
  });

  return (
    <React.Fragment>
      <Swipeable>
        <Swipeable.Item>
          <div className="bg-card rounded-2xl px-4 py-3 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-primary/15 grid place-items-center shrink-0">
                <KeyIcon className="size-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm">{token.name}</p>
                {token.description && (
                  <p className="text-muted-foreground text-xs truncate">{token.description}</p>
                )}
              </div>
              <CopyButton token={token.id} />
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-muted rounded-xl px-3 py-2 font-mono text-xs flex-1 overflow-hidden">
                <span className="truncate block">
                  <SecretValue hide={hideToken}>{token.id}</SecretValue>
                </span>
              </div>
              <HideButtton hide={hideToken} onHideChange={setHideToken} />
            </div>
          </div>
        </Swipeable.Item>
        <Swipeable.Actions>
          <Swipeable.Action
            className="bg-red-400 rounded-r-2xl"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2Icon className="text-white" size={20} />
          </Swipeable.Action>
        </Swipeable.Actions>
      </Swipeable>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Eliminar Token</AlertDialogTitle>
          <AlertDialogDescription>
            Estas seguro que deseas eliminar el token{' '}
            <span className="font-semibold text-foreground">{token.name}</span>. Esto inhabilita
            todas las implementaciones en las que lo uses.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => remove.mutate({ id: token.id })}
              variant="destructive"
            >
              Eliminar token
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
}

export function TokenTable() {
  const { data: tokens } = useSuspenseQuery(tokensQueryOptions);

  if (tokens.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <KeyIcon />
          </EmptyMedia>
          <EmptyTitle>Sin tokens</EmptyTitle>
          <EmptyDescription>
            Aun no tienes tokens creados para usar en atajos. Crea uno para comenzar a usar la API.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <CreateTokenDialog>
            <Button>
              <Plus />
              Crear nuevo token
            </Button>
          </CreateTokenDialog>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="space-y-3">
      {tokens.map((token) => (
        <TokenRow token={token} key={token.id} />
      ))}
    </div>
  );
}
