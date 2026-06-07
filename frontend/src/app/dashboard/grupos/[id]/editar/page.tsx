import { CONFIG } from 'src/global-config';

import { GrupoEditView } from 'src/sections/grupos/edit-view';

export const metadata = { title: `Editar grupo - ${CONFIG.appName}` };

export default function Page() {
  return <GrupoEditView />;
}
