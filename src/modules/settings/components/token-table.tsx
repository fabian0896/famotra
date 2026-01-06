import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function TokenTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Llave de la API</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[1, 2, 3].map((i) => (
          <TableRow key={i}>
            <TableCell className="w-56">
              <p className="font-medium">Iphone 17</p>
              <p className="text-muted-foreground">Api key para manejar shorcuts en mi ihone</p>
            </TableCell>
            <TableCell>
              <span className="text-xs p-2.5 rounded-full border border-muted font-mono">
                fmt_039840298340928304982302938
              </span>
            </TableCell>
            <TableCell>
              <Button size="icon" variant="ghost">
                <MoreVertical />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
