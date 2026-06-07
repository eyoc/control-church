'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useAuthContext } from 'src/auth/hooks';
import { useIglesia } from 'src/hooks/use-iglesia';
import axiosInstance, { endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

interface Stats {
  totalMiembros: number;
  totalGrupos: number;
  asistenciaPromedio: number;
  ingresosMes: number;
}

const formatGTQ = (value: number): string =>
  new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    minimumFractionDigits: 2,
  }).format(value);

// ----------------------------------------------------------------------

export function OverviewView() {
  const { user } = useAuthContext();
  const { iglesiaId } = useIglesia();

  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!iglesiaId) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get<Stats>(endpoints.stats, {
        params: { iglesiaId },
      });
      setStats(res.data);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
    } finally {
      setLoading(false);
    }
  }, [iglesiaId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Bienvenido, {user?.nombre ?? 'Usuario'}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Control-Church — Panel de administración
      </Typography>

      {!iglesiaId && (
        <Typography color="warning.main">
          Selecciona una iglesia para ver las estadísticas.
        </Typography>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && iglesiaId && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Miembros"
              value={stats ? String(stats.totalMiembros) : '—'}
              color="#06B6D4"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Grupos"
              value={stats ? String(stats.totalGrupos) : '—'}
              color="#1A2744"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Asistencia (mes)"
              value={stats ? `${stats.asistenciaPromedio}%` : '—'}
              color="#0891B2"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Ingresos (mes)"
              value={stats ? formatGTQ(stats.ingresosMes) : '—'}
              color="#FFAB00"
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

function StatCard({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 1.5,
            bgcolor: `${color}22`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: color }} />
        </Box>
        <Typography variant="h3">{value}</Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}
