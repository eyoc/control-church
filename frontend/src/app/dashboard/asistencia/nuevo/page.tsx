import { CONFIG } from 'src/global-config';

import { AsistenciaFormView } from 'src/sections/asistencia/form-view';

export const metadata = { title: `Registrar asistencia - ${CONFIG.appName}` };

export default function Page() {
  return <AsistenciaFormView />;
}
