import { CONFIG } from 'src/global-config';

import { MiembroFormView } from 'src/sections/miembros/form-view';

export const metadata = { title: `Nuevo miembro - ${CONFIG.appName}` };

export default function Page() {
  return <MiembroFormView />;
}
