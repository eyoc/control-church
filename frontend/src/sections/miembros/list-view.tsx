'use client';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
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

  useEffect(() => {
    if (!iglesiaId) return;
    setLoading(true);
    axios
      .get<Miembro[]>(endpoints.miembros, { params: { iglesiaId } })
      .then((res) => setMiembros(res.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [iglesiaId]);

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
          Seleccioná una iglesia para ver los miembros.
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
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {miembros.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No hay miembros registrados
                    </TableCell>
                  </TableRow>
                )}
                {miembros.map((m) => (
                  <TableRow key={m.id} hover>
                    <TableCell>
                      {m.nombre} {m.apellido}
                    </TableCell>
                    <TableCell>{m.email ?? '—'}</TableCell>
                    <TableCell>{m.telefono ?? '—'}</TableCell>
                    <TableCell>{m.esActivo ? 'Activo' : 'Inactivo'}</TableCell>
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
