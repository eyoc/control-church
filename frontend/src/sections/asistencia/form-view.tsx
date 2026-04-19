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

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const Schema = zod.object({
  tipo: zod.enum(['servicio', 'celula', 'evento']),
  titulo: zod.string().optional(),
  fecha: zod.string().min(1, 'Requerido'),
  notas: zod.string().optional(),
});

type SchemaType = zod.infer<typeof Schema>;

export function AsistenciaFormView() {
  const router = useRouter();
  const { iglesiaId } = useIglesia();
  const { user } = useAuthContext();
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: {
      tipo: 'servicio',
      titulo: '',
      fecha: new Date().toISOString().split('T')[0],
      notas: '',
    },
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!iglesiaId) throw new Error('Seleccioná una iglesia primero');
      await axios.post(endpoints.asistencia, {
        ...data,
        iglesiaId,
        registradoPor: user?.id,
        titulo: data.titulo || undefined,
        notas: data.notas || undefined,
      });
      router.push(paths.dashboard.asistencia.root);
    } catch (e: any) {
      setError(e.message);
    }
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Registrar asistencia</Typography>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Form methods={methods} onSubmit={onSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Select name="tipo" label="Tipo de evento">
                  <option value="servicio">Servicio</option>
                  <option value="celula">Célula</option>
                  <option value="evento">Evento especial</option>
                </Field.Select>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Field.Text name="fecha" label="Fecha" type="date"
                  slotProps={{ inputLabel: { shrink: true } }} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Field.Text name="titulo" label="Título (opcional)" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Field.Text name="notas" label="Notas" multiline rows={3} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button variant="contained" type="submit" loading={isSubmitting}>Guardar</Button>
          <Button variant="outlined" onClick={() => router.push(paths.dashboard.asistencia.root)}>
            Cancelar
          </Button>
        </Box>
      </Form>
    </Box>
  );
}
