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

type Miembro = {
  id: number;
  nombre: string;
  apellido: string;
  email: string | null;
  telefono: string | null;
  esActivo: boolean;
};

export function MiembrosListView() {
  const { iglesiaId } = useIglesia();
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchData = useCallback(() => {
    if (!iglesiaId) return;
    setLoading(true);
    axios
      .get<Miembro[]>(endpoints.miembros, { params: { iglesiaId } })
      .then((res) => setMiembros(res.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [iglesiaId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${endpoints.miembros}/${deleteId}`);
      setDeleteId(null);
      fetchData();
    } catch (e: any) {
      setError(e.message);
      setDeleteId(null);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Miembros</Typography>
        <Button
          component={RouterLink}
          href={paths.dashboard.miembros.nuevo}
          variant="contained"
        >
          + Nuevo miembro
        </Button>
      </Box>

      {!iglesiaId && (
        <Typography color="warning.main">
          Seleccion&aacute; una iglesia para ver los miembros.
        </Typography>
      )}

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && iglesiaId && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Tel&eacute;fono</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {miembros.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No hay miembros registrados
                    </TableCell>
                  </TableRow>
                )}
                {miembros.map((m) => (
                  <TableRow key={m.id} hover>
                    <TableCell>
                      {m.nombre} {m.apellido}
                    </TableCell>
                    <TableCell>{m.email ?? '\u2014'}</TableCell>
                    <TableCell>{m.telefono ?? '\u2014'}</TableCell>
                    <TableCell>{m.esActivo ? 'Activo' : 'Inactivo'}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={RouterLink}
                        href={paths.dashboard.miembros.editar(m.id)}
                        color="primary"
                        size="small"
                      >
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => setDeleteId(m.id)}
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
        <DialogTitle>Eliminar miembro</DialogTitle>
        <DialogContent>
          <DialogContentText>
            &iquest;Est&aacute;s seguro de que deseas eliminar este miembro? Esta acci&oacute;n no se puede deshacer.
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
