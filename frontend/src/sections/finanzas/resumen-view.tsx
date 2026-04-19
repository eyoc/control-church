'use client';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useIglesia } from 'src/hooks/use-iglesia';

import axios, { endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

type Resumen = {
  totalIngresos: number;
  totalEgresos: number;
  balance: number;
  periodo: string;
};

export function FinanzasResumenView() {
  const { iglesiaId } = useIglesia();
  const [resumen, setResumen] = useState<Resumen | null>(null);

  useEffect(() => {
    if (!iglesiaId) return;
    const now = new Date();
    axios
      .get<Resumen>(endpoints.finanzas.resumen, {
        params: { iglesiaId, mes: now.getMonth() + 1, anio: now.getFullYear() },
      })
      .then((res) => setResumen(res.data))
      .catch(() => {});
  }, [iglesiaId]);

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(n);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Finanzas</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component={RouterLink} href={paths.dashboard.finanzas.ingresos} variant="outlined">
            Ingresos
          </Button>
          <Button component={RouterLink} href={paths.dashboard.finanzas.egresos} variant="outlined">
            Egresos
          </Button>
        </Box>
      </Box>

      {!iglesiaId && (
        <Typography color="warning.main">Seleccioná una iglesia para ver las finanzas.</Typography>
      )}

      {iglesiaId && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="overline" color="text.secondary">Ingresos del mes</Typography>
                <Typography variant="h4" color="success.main">
                  {resumen ? fmt(resumen.totalIngresos) : '—'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="overline" color="text.secondary">Egresos del mes</Typography>
                <Typography variant="h4" color="error.main">
                  {resumen ? fmt(resumen.totalEgresos) : '—'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="overline" color="text.secondary">Balance</Typography>
                <Typography
                  variant="h4"
                  color={resumen && resumen.balance >= 0 ? 'success.main' : 'error.main'}
                >
                  {resumen ? fmt(resumen.balance) : '—'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
