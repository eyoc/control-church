'use client';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useIglesia } from 'src/hooks/use-iglesia';

import axios, { endpoints } from 'src/lib/axios';

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

  useEffect(() => {
    if (!iglesiaId) return;
    setLoading(true);
    axios
      .get<Grupo[]>(endpoints.grupos, { params: { iglesiaId } })
      .then((res) => setGrupos(res.data))
      .finally(() => setLoading(false));
  }, [iglesiaId]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Grupos</Typography>
        <Button component={RouterLink} href={paths.dashboard.grupos.nuevo} variant="contained">
          + Nuevo grupo
        </Button>
      </Box>

      {!iglesiaId && (
        <Typography color="warning.main">Seleccioná una iglesia para ver los grupos.</Typography>
      )}
      {loading && <CircularProgress />}

      {!loading && iglesiaId && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Lugar</TableCell>
                  <TableCell>Día</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {grupos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No hay grupos registrados</TableCell>
                  </TableRow>
                )}
                {grupos.map((g) => (
                  <TableRow key={g.id} hover>
                    <TableCell>{g.nombre}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{g.tipo}</TableCell>
                    <TableCell>{g.lugarReunion ?? '—'}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{g.diaReunion ?? '—'}</TableCell>
                    <TableCell>
                      <Chip
                        label={g.activo ? 'Activo' : 'Inactivo'}
                        color={g.activo ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
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
