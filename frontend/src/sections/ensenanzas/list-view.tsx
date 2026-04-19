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

  useEffect(() => {
    if (!iglesiaId) return;
    setLoading(true);
    axios
      .get<Ensenanza[]>(endpoints.ensenanzas, { params: { iglesiaId } })
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  }, [iglesiaId]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Enseñanzas</Typography>
        <Button component={RouterLink} href={paths.dashboard.ensenanzas.nuevo} variant="contained">
          + Nueva
        </Button>
      </Box>

      {!iglesiaId && (
        <Typography color="warning.main">Seleccioná una iglesia para ver las enseñanzas.</Typography>
      )}
      {loading && <CircularProgress />}

      {!loading && iglesiaId && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Duración</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">Sin enseñanzas registradas</TableCell>
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
                    <TableCell>{e.fecha ?? '—'}</TableCell>
                    <TableCell>{e.duracionMin ? `${e.duracionMin} min` : '—'}</TableCell>
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
