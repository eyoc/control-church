import { CONFIG } from 'src/global-config';

import { GrupoFormView } from 'src/sections/grupos/form-view';

export const metadata = { title: `Nuevo grupo - ${CONFIG.appName}` };

export default function Page() {
  return <GrupoFormView />;
}
