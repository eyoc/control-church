import { CONFIG } from 'src/global-config';

import { FinanzasResumenView } from 'src/sections/finanzas/resumen-view';

export const metadata = { title: `Finanzas - ${CONFIG.appName}` };

export default function Page() {
  return <FinanzasResumenView />;
}
