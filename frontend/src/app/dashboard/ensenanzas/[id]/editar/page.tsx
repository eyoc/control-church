import { CONFIG } from 'src/global-config';

import { EnsenanzaEditView } from 'src/sections/ensenanzas/edit-view';

export const metadata = { title: `Editar ense\u00f1anza - ${CONFIG.appName}` };

export default function Page() {
  return <EnsenanzaEditView />;
}
