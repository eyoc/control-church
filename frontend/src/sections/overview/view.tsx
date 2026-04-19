'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function OverviewView() {
  const { user } = useAuthContext();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Bienvenido, {user?.nombre ?? 'Usuario'} 👋
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Control-Church — Panel de administración
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Miembros" value="—" color="#00A76F" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Grupos" value="—" color="#8E33FF" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Asistencia (mes)" value="—" color="#00B8D9" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Ingresos (mes)" value="—" color="#FFAB00" />
        </Grid>
      </Grid>
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
