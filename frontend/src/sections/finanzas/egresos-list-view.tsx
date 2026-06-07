'use client';

import { useEffect, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContentText from '@mui/material/DialogContentText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useIglesia } from 'src/hooks/use-iglesia';

import axios, { endpoints } from 'src/lib/axios';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Egreso = {
  id: number;
  fecha: string;
  monto: number;
  descripcion: string;
  beneficiario: string | null;
};

export function EgresosListView() {
  const { iglesiaId } = useIglesia();
  const [items, setItems] = useState<Egreso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchData = useCallback(() => {
    if (!iglesiaId) return;
    setLoading(true);
    axios
      .get<Egreso[]>(endpoints.finanzas.egresos, { params: { iglesiaId } })
      .then((res) => setItems(res.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [iglesiaId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${endpoints.finanzas.egresos}/${deleteId}`);
      setDeleteId(null);
      fetchData();
    } catch (e: any) {
      setError(e.message);
      setDeleteId(null);
    }
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(n);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Egresos</Typography>
        <Button
          component={RouterLink}
          href={paths.dashboard.finanzas.egresosNuevo}
          variant="contained"
        >
          + Nuevo egreso
        </Button>
      </Box>

      {!iglesiaId && (
        <Typography color="warning.main">Seleccion&aacute; una iglesia primero.</Typography>
      )}
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && iglesiaId && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Descripci&oacute;n</TableCell>
                  <TableCell>Monto</TableCell>
                  <TableCell>Beneficiario</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Sin egresos registrados</TableCell>
                  </TableRow>
                )}
                {items.map((i) => (
                  <TableRow key={i.id} hover>
                    <TableCell>{i.fecha}</TableCell>
                    <TableCell>{i.descripcion}</TableCell>
                    <TableCell>{fmt(i.monto)}</TableCell>
                    <TableCell>{i.beneficiario ?? '\u2014'}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => setDeleteId(i.id)}
                      >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Eliminar egreso</DialogTitle>
        <DialogContent>
          <DialogContentText>
            &iquest;Est&aacute;s seguro de que deseas eliminar este egreso? Esta acci&oacute;n no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
