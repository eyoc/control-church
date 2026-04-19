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

const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const TIPOS = ['celula', 'departamento', 'ministerio'];

const Schema = zod.object({
  nombre: zod.string().min(1, 'Requerido'),
  tipo: zod.string().min(1, 'Requerido'),
  descripcion: zod.string().optional(),
  lugarReunion: zod.string().optional(),
  diaReunion: zod.string().optional(),
});

type SchemaType = zod.infer<typeof Schema>;

export function GrupoFormView() {
  const router = useRouter();
  const { iglesiaId } = useIglesia();
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: { nombre: '', tipo: 'celula', descripcion: '', lugarReunion: '', diaReunion: '' },
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!iglesiaId) throw new Error('Seleccioná una iglesia primero');
      await axios.post(endpoints.grupos, {
        ...data,
        iglesiaId,
        diaReunion: data.diaReunion || undefined,
      });
      router.push(paths.dashboard.grupos.root);
    } catch (e: any) {
      setError(e.message);
    }
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Nuevo grupo</Typography>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Form methods={methods} onSubmit={onSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Text name="nombre" label="Nombre *" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Select name="tipo" label="Tipo">
                  {TIPOS.map((t) => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </Field.Select>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Text name="lugarReunion" label="Lugar de reunión" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Select name="diaReunion" label="Día de reunión">
                  <option value="">Sin especificar</option>
                  {DIAS.map((d) => (
                    <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                  ))}
                </Field.Select>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Field.Text name="descripcion" label="Descripción" multiline rows={2} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button variant="contained" type="submit" loading={isSubmitting}>Guardar</Button>
          <Button variant="outlined" onClick={() => router.push(paths.dashboard.grupos.root)}>Cancelar</Button>
        </Box>
      </Form>
    </Box>
  );
}
