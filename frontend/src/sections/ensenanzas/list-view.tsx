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

type Ensenanza = {
  id: number;
  titulo: string;
  tipo: string;
  fecha: string | null;
  duracionMin: number | null;
  activo: boolean;
};

const TIPO_COLORS: Record<string, 'primary' | 'secondary' | 'default'> = {
  sermon: 'primary',
  estudio: 'secondary',
  material: 'default',
};

export function EnsenanzasListView() {
  const { iglesiaId } = useIglesia();
  const [items, setItems] = useState<Ensenanza[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchData = useCallback(() => {
    if (!iglesiaId) return;
    setLoading(true);
    axios
      .get<Ensenanza[]>(endpoints.ensenanzas, { params: { iglesiaId } })
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
      await axios.delete(`${endpoints.ensenanzas}/${deleteId}`);
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
        <Typography variant="h4">Ense&ntilde;anzas</Typography>
        <Button component={RouterLink} href={paths.dashboard.ensenanzas.nuevo} variant="contained">
          + Nueva
        </Button>
      </Box>

      {!iglesiaId && (
        <Typography color="warning.main">Seleccion&aacute; una iglesia para ver las ense&ntilde;anzas.</Typography>
      )}
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && iglesiaId && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>T&iacute;tulo</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Duraci&oacute;n</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Sin ense&ntilde;anzas registradas</TableCell>
                  </TableRow>
                )}
                {items.map((e) => (
                  <TableRow key={e.id} hover>
                    <TableCell>{e.titulo}</TableCell>
                    <TableCell>
                      <Chip
                        label={e.tipo}
                        color={TIPO_COLORS[e.tipo] ?? 'default'}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>{e.fecha ?? '\u2014'}</TableCell>
                    <TableCell>{e.duracionMin ? `${e.duracionMin} min` : '\u2014'}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={RouterLink}
                        href={paths.dashboard.ensenanzas.editar(e.id)}
                        color="primary"
                        size="small"
                      >
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => setDeleteId(e.id)}
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
        <DialogTitle>Eliminar ense&ntilde;anza</DialogTitle>
        <DialogContent>
          <DialogContentText>
            &iquest;Est&aacute;s seguro de que deseas eliminar esta ense&ntilde;anza? Esta acci&oacute;n no se puede deshacer.
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
