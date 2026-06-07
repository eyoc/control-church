import { CONFIG } from 'src/global-config';

import { AsistenciaDetailView } from 'src/sections/asistencia/detail-view';

export const metadata = { title: `Detalle asistencia - ${CONFIG.appName}` };

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  return <AsistenciaDetailView id={params.id} />;
}
