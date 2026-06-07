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
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter, useParams } from 'src/routes/hooks';

import { useIglesia } from 'src/hooks/use-iglesia';

import axios, { endpoints } from 'src/lib/axios';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const Schema = zod.object({
  titulo: zod.string().min(1, 'Requerido'),
  descripcion: zod.string().optional(),
  tipo: zod.enum(['sermon', 'estudio', 'material']).optional(),
  fecha: zod.string().optional(),
  tags: zod.string().optional(),
});

type SchemaType = zod.infer<typeof Schema>;

export function EnsenanzaEditView() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { iglesiaId } = useIglesia();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const methods = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: {
      titulo: '',
      descripcion: '',
      tipo: 'sermon',
      fecha: '',
      tags: '',
    },
  });

  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  useEffect(() => {
    if (!params.id) return;
    setLoading(true);
    axios
      .get(`${endpoints.ensenanzas}/${params.id}`)
      .then((res) => {
        const d = res.data;
        reset({
          titulo: d.titulo ?? '',
          descripcion: d.descripcion ?? '',
          tipo: d.tipo ?? 'sermon',
          fecha: d.fecha ? d.fecha.split('T')[0] : '',
          tags: d.tags ?? '',
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [params.id, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!iglesiaId) throw new Error('Selecciona una iglesia primero');
      await axios.put(`${endpoints.ensenanzas}/${params.id}`, {
        ...data,
        iglesiaId,
        descripcion: data.descripcion || undefined,
        tags: data.tags || undefined,
      });
      router.push(paths.dashboard.ensenanzas.root);
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
      <Typography variant="h4" sx={{ mb: 3 }}>Editar ense&ntilde;anza</Typography>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Form methods={methods} onSubmit={onSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Text name="titulo" label="Titulo *" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Select name="tipo" label="Tipo">
                  <MenuItem value="sermon">Sermon</MenuItem>
                  <MenuItem value="estudio">Estudio biblico</MenuItem>
                  <MenuItem value="material">Material</MenuItem>
                </Field.Select>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Text name="fecha" label="Fecha" type="date"
                  slotProps={{ inputLabel: { shrink: true } }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Text name="tags" label="Tags (separados por coma)" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Field.Text name="descripcion" label="Descripcion" multiline rows={3} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button variant="contained" type="submit" loading={isSubmitting}>Guardar cambios</Button>
          <Button variant="outlined" onClick={() => router.push(paths.dashboard.ensenanzas.root)}>
            Cancelar
          </Button>
        </Box>
      </Form>
    </Box>
  );
}
