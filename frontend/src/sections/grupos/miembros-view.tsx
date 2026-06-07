'use client';

import { useEffect, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useIglesia } from 'src/hooks/use-iglesia';

import { Iconify } from 'src/components/iconify';

import axios, { endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

type Miembro = {
  id: number;
  nombre: string;
  apellido: string;
};

type GrupoMiembro = {
  id: number;
  miembroId: number;
  fechaIngreso: string;
  miembro: Miembro;
};

type Grupo = {
  id: number;
  nombre: string;
};

type Props = {
  grupoId: string;
};

export function GrupoMiembrosView({ grupoId }: Props) {
  const router = useRouter();
  const { iglesiaId } = useIglesia();

  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [miembrosGrupo, setMiembrosGrupo] = useState<GrupoMiembro[]>([]);
  const [todosLosMiembros, setTodosLosMiembros] = useState<Miembro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Dialog state
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedMiembroId, setSelectedMiembroId] = useState<string>('');
  const [adding, setAdding] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<GrupoMiembro | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [grupoRes, miembrosGrupoRes, todosRes] = await Promise.all([
        axios.get(`${endpoints.grupos}/${grupoId}`),
        axios.get(`${endpoints.grupos}/${grupoId}/miembros`),
        iglesiaId
          ? axios.get(endpoints.miembros, { params: { iglesiaId } })
          : Promise.resolve({ data: [] }),
      ]);
      setGrupo(grupoRes.data);
      setMiembrosGrupo(miembrosGrupoRes.data);
      setTodosLosMiembros(todosRes.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [grupoId, iglesiaId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = async () => {
    if (!selectedMiembroId) return;
    try {
      setAdding(true);
      await axios.post(`${endpoints.grupos}/${grupoId}/miembros`, {
        miembroId: Number(selectedMiembroId),
        fechaIngreso: new Date().toISOString().split('T')[0],
      });
      setSuccess('Miembro agregado al grupo');
      setOpenAdd(false);
      setSelectedMiembroId('');
      fetchData();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${endpoints.grupos}/${grupoId}/miembros/${deleteTarget.miembroId}`);
      setSuccess('Miembro removido del grupo');
      setDeleteTarget(null);
      fetchData();
    } catch (e: any) {
      setError(e.message);
    }
  };

  // Filter out members already in the group
  const miembrosGrupoIds = new Set(miembrosGrupo.map((mg) => mg.miembroId));
  const miembrosDisponibles = todosLosMiembros.filter((m) => !miembrosGrupoIds.has(m.id));

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        size="small"
        color="inherit"
        onClick={() => router.push(paths.dashboard.grupos.root)}
        startIcon={<Iconify icon="eva:arrow-back-fill" />}
        sx={{ mb: 1 }}
      >
        Volver a grupos
      </Button>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4">
          Miembros de {grupo?.nombre ?? 'Grupo'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setOpenAdd(true)}
          disabled={miembrosDisponibles.length === 0}
        >
          Agregar miembro
        </Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Fecha ingreso</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {miembrosGrupo.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography color="text.secondary" sx={{ py: 3 }}>
                      No hay miembros en este grupo
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                miembrosGrupo.map((mg) => (
                  <TableRow key={mg.id}>
                    <TableCell>{mg.miembro?.nombre} {mg.miembro?.apellido}</TableCell>
                    <TableCell>{mg.fechaIngreso}</TableCell>
                    <TableCell align="right">
                      <IconButton color="error" onClick={() => setDeleteTarget(mg)}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add member dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="xs">
        <DialogTitle>Agregar miembro al grupo</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Seleccionar miembro"
            value={selectedMiembroId}
            onChange={(e) => setSelectedMiembroId(e.target.value)}
            sx={{ mt: 1 }}
          >
            {miembrosDisponibles.map((m) => (
              <MenuItem key={m.id} value={String(m.id)}>
                {m.nombre} {m.apellido}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAdd} disabled={!selectedMiembroId || adding}>
            {adding ? 'Agregando...' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>¿Remover miembro?</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de remover a {deleteTarget?.miembro?.nombre} {deleteTarget?.miembro?.apellido} de este grupo?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleRemove}>Remover</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
