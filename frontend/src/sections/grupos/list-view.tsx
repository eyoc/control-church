'use client';

import { useEffect, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
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

type Grupo = {
  id: number;
  nombre: string;
  tipo: string;
  lugarReunion: string | null;
  diaReunion: string | null;
  activo: boolean;
};

export function GruposListView() {
  const { iglesiaId } = useIglesia();
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchData = useCallback(() => {
    if (!iglesiaId) return;
    setLoading(true);
    axios
      .get<Grupo[]>(endpoints.grupos, { params: { iglesiaId } })
      .then((res) => setGrupos(res.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [iglesiaId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${endpoints.grupos}/${deleteId}`);
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
        <Typography variant="h4">Grupos</Typography>
        <Button component={RouterLink} href={paths.dashboard.grupos.nuevo} variant="contained">
          + Nuevo grupo
        </Button>
      </Box>

      {!iglesiaId && (
        <Typography color="warning.main">Seleccion&aacute; una iglesia para ver los grupos.</Typography>
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
                  <TableCell>Tipo</TableCell>
                  <TableCell>Lugar</TableCell>
                  <TableCell>D&iacute;a</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {grupos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No hay grupos registrados</TableCell>
                  </TableRow>
                )}
                {grupos.map((g) => (
                  <TableRow key={g.id} hover>
                    <TableCell>{g.nombre}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{g.tipo}</TableCell>
                    <TableCell>{g.lugarReunion ?? '\u2014'}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{g.diaReunion ?? '\u2014'}</TableCell>
                    <TableCell>
                      <Chip
                        label={g.activo ? 'Activo' : 'Inactivo'}
                        color={g.activo ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={RouterLink}
                        href={paths.dashboard.grupos.editar(g.id)}
                        color="primary"
                        size="small"
                      >
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => setDeleteId(g.id)}
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
        <DialogTitle>Eliminar grupo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            &iquest;Est&aacute;s seguro de que deseas eliminar este grupo? Esta acci&oacute;n no se puede deshacer.
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
