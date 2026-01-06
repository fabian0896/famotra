import {
  AlertCircleIcon,
  CheckIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  MoreVertical,
  Trash2Icon,
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import React, { useState } from 'react';
import { tokensQueryOptions } from '../query-options/tokens';
import { TokenService } from '../services/tokens';
import type { Token } from '../models/tokens.model';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
      <TableRow>
        <TableCell className="w-56 px-4 whitespace-normal">
          <div className="flex flex-col">
            <span className="font-medium mb-1">{token.name}</span>
            <span className="text-muted-foreground">{token.description}</span>
          </div>
        </TableCell>
        <TableCell className="px-4">
          <div className="flex items-center gap-2">
            <div className="text-xs relative flex py-1 px-2.5 rounded-full border font-mono bg-muted overflow-hidden w-[300px] h-[26px]">
              <span className="truncate">
                <SecretValue hide={hideToken}>{token.token}</SecretValue>
              </span>
            </div>
            <HideButtton hide={hideToken} onHideChange={setHideToken} />
            <CopyButton token={token.token} />
          </div>
        </TableCell>
        <TableCell className="px-4">
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setConfirmOpen(true)} variant="destructive">
                  <Trash2Icon />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>
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
  const { data: tokens, isLoading, error } = useQuery(tokensQueryOptions);

  if (isLoading) {
    return <Skeleton className="w-full h-40 rounded-md" />;
  }

  if (error) {
    return (
      <Alert>
        <AlertCircleIcon />
        <AlertTitle>Algo salió mal</AlertTitle>
        <AlertDescription>{formatError(error).message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table className="bg-card">
        <TableHeader className="bg-background">
          <TableRow>
            <TableHead className="px-4 w-56">Nombre</TableHead>
            <TableHead className="px-4">Token</TableHead>
            <TableHead className="px-4"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens?.map((token) => (
            <TokenRow token={token} key={token.id} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
