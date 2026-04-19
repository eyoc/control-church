import { CONFIG } from 'src/global-config';

import { MiembrosListView } from 'src/sections/miembros/list-view';

export const metadata = { title: `Miembros - ${CONFIG.appName}` };

export default function Page() {
  return <MiembrosListView />;
}
