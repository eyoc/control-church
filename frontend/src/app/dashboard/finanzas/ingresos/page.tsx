import { CONFIG } from 'src/global-config';

import { IngresosListView } from 'src/sections/finanzas/ingresos-list-view';

export const metadata = { title: `Ingresos - ${CONFIG.appName}` };

export default function Page() {
  return <IngresosListView />;
}
