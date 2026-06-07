'use client';

import { z as zod } from 'zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useIglesia } from 'src/hooks/use-iglesia';

import axios, { endpoints } from 'src/lib/axios';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Categoria = {
  id: number;
  nombre: string;
  tipo: string;
};

const Schema = zod.object({
  monto: zod.coerce.number().min(0.01, 'El monto debe ser mayor a 0'),
  fecha: zod.string().min(1, 'Requerido'),
  descripcion: zod.string().optional(),
  categoriaId: zod.coerce.number().optional(),
  emitirRecibo: zod.boolean().optional(),
  nitDonante: zod.string().optional(),
  nombreFiscal: zod.string().optional(),
});

type SchemaType = zod.infer<typeof Schema>;

export function IngresoFormView() {
  const router = useRouter();
  const { iglesiaId } = useIglesia();
  const [error, setError] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const methods = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: {
      monto: 0,
      fecha: new Date().toISOString().split('T')[0],
      descripcion: '',
      categoriaId: undefined,
      emitirRecibo: false,
      nitDonante: 'CF',
      nombreFiscal: '',
    },
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  useEffect(() => {
    if (!iglesiaId) return;
    axios
      .get<Categoria[]>(endpoints.finanzas.categorias, { params: { iglesiaId } })
      .then((res) => setCategorias(res.data.filter((c) => c.tipo === 'ingreso')));
  }, [iglesiaId]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!iglesiaId) throw new Error('Selecciona una iglesia primero');
      await axios.post(endpoints.finanzas.ingresos, {
        ...data,
        iglesiaId,
        categoriaId: data.categoriaId || undefined,
        descripcion: data.descripcion || undefined,
        nitDonante: data.nitDonante || undefined,
        nombreFiscal: data.nombreFiscal || undefined,
      });
      router.push(paths.dashboard.finanzas.ingresos);
    } catch (e: any) {
      setError(e.message);
    }
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Nuevo ingreso</Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Form methods={methods} onSubmit={onSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Text name="monto" label="Monto *" type="number" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Text name="fecha" label="Fecha *" type="date"
                  slotProps={{ inputLabel: { shrink: true } }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Select name="categoriaId" label="Categoria">
                  <MenuItem value="">Sin categoria</MenuItem>
                  {categorias.map((c) => (
                    <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
                  ))}
                </Field.Select>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Switch name="emitirRecibo" label="Emitir recibo" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Text name="nitDonante" label="NIT donante" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Text name="nombreFiscal" label="Nombre fiscal" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Field.Text name="descripcion" label="Descripcion" multiline rows={3} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button variant="contained" type="submit" loading={isSubmitting}>
            Guardar
          </Button>
          <Button variant="outlined" onClick={() => router.push(paths.dashboard.finanzas.ingresos)}>
            Cancelar
          </Button>
        </Box>
      </Form>
    </Box>
  );
}
