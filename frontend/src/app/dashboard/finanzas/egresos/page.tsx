import { CONFIG } from 'src/global-config';

import { EgresosListView } from 'src/sections/finanzas/egresos-list-view';

export const metadata = { title: `Egresos - ${CONFIG.appName}` };

export default function Page() {
  return <EgresosListView />;
}
