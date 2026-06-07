'use client';

import { useParams } from 'src/routes/hooks';

import { AsistenciaDetailView } from 'src/sections/asistencia/detail-view';

// ----------------------------------------------------------------------

export default function Page() {
  const { id } = useParams();

  return <AsistenciaDetailView id={id as string} />;
}
