import { CONFIG } from 'src/global-config';

import { GruposListView } from 'src/sections/grupos/list-view';

export const metadata = { title: `Grupos - ${CONFIG.appName}` };

export default function Page() {
  return <GruposListView />;
}
