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
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter, useParams } from 'src/routes/hooks';

import { useIglesia } from 'src/hooks/use-iglesia';

import axios, { endpoints } from 'src/lib/axios';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const Schema = zod.object({
  nombre: zod.string().min(1, 'Requerido'),
  apellido: zod.string().min(1, 'Requerido'),
  email: zod.string().email('Email invalido').optional().or(zod.literal('')),
  telefono: zod.string().optional(),
  fechaNacimiento: zod.string().optional(),
  genero: zod.enum(['M', 'F', '']).optional(),
  direccion: zod.string().optional(),
  fechaIngreso: zod.string().optional(),
});

type SchemaType = zod.infer<typeof Schema>;

export function MiembroEditView() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { iglesiaId } = useIglesia();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const methods = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      genero: '',
      direccion: '',
      fechaIngreso: '',
    },
  });

  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  useEffect(() => {
    if (!params.id) return;
    setLoading(true);
    axios
      .get(`${endpoints.miembros}/${params.id}`)
      .then((res) => {
        const d = res.data;
        reset({
          nombre: d.nombre ?? '',
          apellido: d.apellido ?? '',
          email: d.email ?? '',
          telefono: d.telefono ?? '',
          genero: d.genero ?? '',
          direccion: d.direccion ?? '',
          fechaIngreso: d.fechaIngreso ? d.fechaIngreso.split('T')[0] : '',
          fechaNacimiento: d.fechaNacimiento ? d.fechaNacimiento.split('T')[0] : '',
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [params.id, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!iglesiaId) throw new Error('Selecciona una iglesia primero');
      await axios.put(`${endpoints.miembros}/${params.id}`, {
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

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Editar miembro</Typography>

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
                <Field.Text name="telefono" label="Telefono" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Select name="genero" label="Genero">
                  <MenuItem value="">Sin especificar</MenuItem>
                  <MenuItem value="M">Masculino</MenuItem>
                  <MenuItem value="F">Femenino</MenuItem>
                </Field.Select>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Text name="fechaIngreso" label="Fecha de ingreso" type="date"
                  slotProps={{ inputLabel: { shrink: true } }} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Field.Text name="direccion" label="Direccion" multiline rows={2} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button variant="contained" type="submit" loading={isSubmitting}>
            Guardar cambios
          </Button>
          <Button variant="outlined" onClick={() => router.push(paths.dashboard.miembros.root)}>
            Cancelar
          </Button>
        </Box>
      </Form>
    </Box>
  );
}
