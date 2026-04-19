import { CONFIG } from 'src/global-config';

import { AsistenciaListView } from 'src/sections/asistencia/list-view';

export const metadata = { title: `Asistencia - ${CONFIG.appName}` };

export default function Page() {
  return <AsistenciaListView />;
}
