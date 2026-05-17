import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { redirect } from 'next/navigation';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Control-Church — Conecta. Crece. Sirve.`,
  description: 'Sistema de gestión para iglesias — por tuLogro',
};

export default function Page() {
  redirect(CONFIG.auth.redirectPath);
}
