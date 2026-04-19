'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useIglesia } from 'src/hooks/use-iglesia';

import axios, { endpoints } from 'src/lib/axios';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const Schema = zod.object({
  nombre: zod.string().min(1, 'Requerido'),
  apellido: zod.string().min(1, 'Requerido'),
  email: zod.string().email('Email inválido').optional().or(zod.literal('')),
  telefono: zod.string().optional(),
  fechaNacimiento: zod.string().optional(),
  genero: zod.enum(['M', 'F', '']).optional(),
  direccion: zod.string().optional(),
  fechaIngreso: zod.string().optional(),
});

type SchemaType = zod.infer<typeof Schema>;

export function MiembroFormView() {
  const router = useRouter();
  const { iglesiaId } = useIglesia();
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      genero: '',
      direccion: '',
      fechaIngreso: new Date().toISOString().split('T')[0],
    },
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!iglesiaId) throw new Error('Seleccioná una iglesia primero');
      await axios.post(endpoints.miembros, {
        ...data,
        iglesiaId,
        email: data.email || undefined,
        genero: data.genero || undefined,
      });
      router.push(paths.dashboard.miembros.root);
    } catch (e: any) {
      setError(e.message);
    }
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Nuevo miembro</Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Form methods={methods} onSubmit={onSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Text name="nombre" label="Nombre *" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Text name="apellido" label="Apellido *" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Text name="email" label="Email" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Text name="telefono" label="Teléfono" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Select name="genero" label="Género">
                  <option value="">Sin especificar</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </Field.Select>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Text name="fechaIngreso" label="Fecha de ingreso" type="date"
                  slotProps={{ inputLabel: { shrink: true } }} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Field.Text name="direccion" label="Dirección" multiline rows={2} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button variant="contained" type="submit" loading={isSubmitting}>
            Guardar
          </Button>
          <Button variant="outlined" onClick={() => router.push(paths.dashboard.miembros.root)}>
            Cancelar
          </Button>
        </Box>
      </Form>
    </Box>
  );
}
