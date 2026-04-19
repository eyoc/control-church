import { CONFIG } from 'src/global-config';

import { EnsenanzasListView } from 'src/sections/ensenanzas/list-view';

export const metadata = { title: `Enseñanzas - ${CONFIG.appName}` };

export default function Page() {
  return <EnsenanzasListView />;
}
