import { CONFIG } from 'src/global-config';

import { MiembroEditView } from 'src/sections/miembros/edit-view';

export const metadata = { title: `Editar miembro - ${CONFIG.appName}` };

export default function Page() {
  return <MiembroEditView />;
}
