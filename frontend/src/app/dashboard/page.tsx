import { CONFIG } from 'src/global-config';

import { OverviewView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Resumen - ${CONFIG.appName}` };

export default function Page() {
  return <OverviewView />;
}
