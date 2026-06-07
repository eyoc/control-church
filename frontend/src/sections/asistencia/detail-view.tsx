'use client';

import { useEffect, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Iconify from 'src/components/iconify';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useIglesia } from 'src/hooks/use-iglesia';

import axios, { endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

type Miembro = {
  id: number;
  nombres: string;
  apellidos: string;
  fotoUrl?: string;
};

type DetalleItem = {
  id?: number;
  miembroId: number;
  presente: boolean;
  justificado: boolean;
  notas?: string;
  miembro?: Miembro;
};

type AsistenciaRecord = {
  id: number;
  iglesiaId: number;
  tipo: string;
  titulo: string | null;
  fecha: string;
  notas: string | null;
  detalle: DetalleItem[];
};

const TIPO_LABELS: Record<string, string> = {
  servicio: 'Servicio',
  celula: 'Celula',
  evento: 'Evento especial',
};

const TIPO_COLORS: Record<string, 'primary' | 'secondary' | 'default'> = {
  servicio: 'primary',
  celula: 'secondary',
  evento: 'default',
};

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export function AsistenciaDetailView({ id }: Props) {
  const router = useRouter();
  const { iglesiaId } = useIglesia();

  const [asistencia, setAsistencia] = useState<AsistenciaRecord | null>(null);
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [presentes, setPresentes] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Fetch asistencia record and miembros list
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [asistRes, miembrosRes] = await Promise.all([
          axios.get<AsistenciaRecord>(`${endpoints.asistencia}/${id}`),
          iglesiaId
            ? axios.get<Miembro[]>(endpoints.miembros, { params: { iglesiaId } })
            : Promise.resolve({ data: [] as Miembro[] }),
        ]);

        setAsistencia(asistRes.data);
        setMiembros(miembrosRes.data);

        // Pre-check members already in detalle
        const presenteIds = new Set(
          asistRes.data.detalle
            .filter((d) => d.presente)
            .map((d) => d.miembroId)
        );
        setPresentes(presenteIds);
      } catch (e: any) {
        setError(e.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, iglesiaId]);

  const handleToggle = useCallback((miembroId: number) => {
    setPresentes((prev) => {
      const next = new Set(prev);
      if (next.has(miembroId)) {
        next.delete(miembroId);
      } else {
        next.add(miembroId);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setPresentes(new Set(miembros.map((m) => m.id)));
  }, [miembros]);

  const handleDeselectAll = useCallback(() => {
    setPresentes(new Set());
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const detalle = Array.from(presentes).map((miembroId) => ({
        miembroId,
        presente: true,
        justificado: false,
      }));

      await axios.put(`${endpoints.asistencia}/${id}`, { detalle });
      setSuccess('Asistencia guardada correctamente');
    } catch (e: any) {
      setError(e.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  // Filter members by search
  const filteredMiembros = miembros.filter((m) => {
    if (!search) return true;
    const fullName = `${m.nombres} ${m.apellidos}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!asistencia) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">No se encontro el registro de asistencia</Alert>
      </Box>
    );
  }

  const presenteCount = presentes.size;
  const totalCount = miembros.length;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          size="small"
          color="inherit"
          onClick={() => router.push(paths.dashboard.asistencia.root)}
          startIcon={<Iconify icon="eva:arrow-back-fill" />}
          sx={{ mb: 1 }}
        >
          Volver
        </Button>

        <Typography variant="h4" sx={{ mb: 1 }}>
          Registrar asistencia
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Chip
            label={TIPO_LABELS[asistencia.tipo] ?? asistencia.tipo}
            color={TIPO_COLORS[asistencia.tipo] ?? 'default'}
            size="small"
          />
          <Typography variant="body2" color="text.secondary">
            {asistencia.fecha}
          </Typography>
          {asistencia.titulo && (
            <Typography variant="subtitle1">
              — {asistencia.titulo}
            </Typography>
          )}
        </Stack>

        {asistencia.notas && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {asistencia.notas}
          </Typography>
        )}
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Counter + Actions */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ sm: 'center' }}
            justifyContent="space-between"
          >
            <Typography variant="h6">
              {presenteCount} / {totalCount} presentes
            </Typography>

            <Stack direction="row" spacing={1}>
              <Button size="small" variant="outlined" onClick={handleSelectAll}>
                Marcar todos
              </Button>
              <Button size="small" variant="outlined" color="inherit" onClick={handleDeselectAll}>
                Desmarcar todos
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Buscar miembro..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Members list */}
      <Card>
        {miembros.length === 0 ? (
          <CardContent>
            <Typography color="text.secondary" align="center">
              No hay miembros registrados en esta iglesia
            </Typography>
          </CardContent>
        ) : (
          <List disablePadding>
            {filteredMiembros.map((miembro) => {
              const isChecked = presentes.has(miembro.id);
              return (
                <ListItem key={miembro.id} disablePadding divider>
                  <ListItemButton onClick={() => handleToggle(miembro.id)} dense>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Checkbox
                        edge="start"
                        checked={isChecked}
                        tabIndex={-1}
                        disableRipple
                        color="primary"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${miembro.nombres} ${miembro.apellidos}`}
                      primaryTypographyProps={{
                        fontWeight: isChecked ? 600 : 400,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}

            {filteredMiembros.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="No se encontraron miembros"
                  primaryTypographyProps={{ color: 'text.secondary', align: 'center' }}
                />
              </ListItem>
            )}
          </List>
        )}
      </Card>

      {/* Save button - sticky on mobile */}
      <Box
        sx={{
          mt: 3,
          pb: 2,
          position: 'sticky',
          bottom: 0,
          bgcolor: 'background.default',
          zIndex: 1,
          display: 'flex',
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleSave}
          disabled={saving}
          sx={{ maxWidth: { sm: 300 } }}
        >
          {saving ? 'Guardando...' : 'Guardar asistencia'}
        </Button>
      </Box>
    </Box>
  );
}
