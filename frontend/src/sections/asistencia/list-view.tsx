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

type Asistencia = {
  id: number;
  tipo: string;
  titulo: string | null;
  fecha: string;
  notas: string | null;
};

const TIPO_COLORS: Record<string, 'primary' | 'secondary' | 'default'> = {
  servicio: 'primary',
  celula: 'secondary',
  evento: 'default',
};

export function AsistenciaListView() {
  const { iglesiaId } = useIglesia();
  const [registros, setRegistros] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!iglesiaId) return;
    setLoading(true);
    axios
      .get<Asistencia[]>(endpoints.asistencia, { params: { iglesiaId } })
      .then((res) => setRegistros(res.data))
      .finally(() => setLoading(false));
  }, [iglesiaId]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Asistencia</Typography>
        <Button component={RouterLink} href={paths.dashboard.asistencia.nuevo} variant="contained">
          + Registrar
        </Button>
      </Box>

      {!iglesiaId && (
        <Typography color="warning.main">Seleccioná una iglesia para ver los registros.</Typography>
      )}
      {loading && <CircularProgress />}

      {!loading && iglesiaId && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Título</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Notas</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registros.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No hay registros de asistencia</TableCell>
                  </TableRow>
                )}
                {registros.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell>{r.fecha}</TableCell>
                    <TableCell>{r.titulo ?? '—'}</TableCell>
                    <TableCell>
                      <Chip
                        label={r.tipo}
                        color={TIPO_COLORS[r.tipo] ?? 'default'}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>{r.notas ?? '—'}</TableCell>
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
