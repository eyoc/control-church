'use client';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useIglesia } from 'src/hooks/use-iglesia';

import axios, { endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

type Ingreso = {
  id: number;
  fecha: string;
  monto: number;
  moneda: string;
  descripcion: string | null;
  numeroRecibo: string | null;
};

export function IngresosListView() {
  const { iglesiaId } = useIglesia();
  const [items, setItems] = useState<Ingreso[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!iglesiaId) return;
    setLoading(true);
    axios
      .get<Ingreso[]>(endpoints.finanzas.ingresos, { params: { iglesiaId } })
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  }, [iglesiaId]);

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(n);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Ingresos</Typography>

      {!iglesiaId && (
        <Typography color="warning.main">Seleccioná una iglesia primero.</Typography>
      )}
      {loading && <CircularProgress />}

      {!loading && iglesiaId && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Monto</TableCell>
                  <TableCell>Recibo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">Sin ingresos registrados</TableCell>
                  </TableRow>
                )}
                {items.map((i) => (
                  <TableRow key={i.id} hover>
                    <TableCell>{i.fecha}</TableCell>
                    <TableCell>{i.descripcion ?? '—'}</TableCell>
                    <TableCell>{fmt(i.monto)}</TableCell>
                    <TableCell>{i.numeroRecibo ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Box>
  );
}
