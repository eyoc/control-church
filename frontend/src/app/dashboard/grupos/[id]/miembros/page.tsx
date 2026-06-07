'use client';

import { useParams } from 'src/routes/hooks';

import { GrupoMiembrosView } from 'src/sections/grupos/miembros-view';

export default function Page() {
  const { id } = useParams();

  return <GrupoMiembrosView grupoId={id as string} />;
}
