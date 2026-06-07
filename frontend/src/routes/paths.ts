// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
  },
  dashboard: {
    root: ROOTS.DASHBOARD,
    miembros: {
      root: `${ROOTS.DASHBOARD}/miembros`,
      nuevo: `${ROOTS.DASHBOARD}/miembros/nuevo`,
      editar: (id: number) => `${ROOTS.DASHBOARD}/miembros/${id}/editar`,
    },
    grupos: {
      root: `${ROOTS.DASHBOARD}/grupos`,
      nuevo: `${ROOTS.DASHBOARD}/grupos/nuevo`,
      editar: (id: number) => `${ROOTS.DASHBOARD}/grupos/${id}/editar`,
    },
    asistencia: {
      root: `${ROOTS.DASHBOARD}/asistencia`,
      nuevo: `${ROOTS.DASHBOARD}/asistencia/nuevo`,
      detalle: (id: string | number) => `${ROOTS.DASHBOARD}/asistencia/${id}`,
    },
    finanzas: {
      root: `${ROOTS.DASHBOARD}/finanzas`,
      ingresos: `${ROOTS.DASHBOARD}/finanzas/ingresos`,
      ingresosNuevo: `${ROOTS.DASHBOARD}/finanzas/ingresos/nuevo`,
      egresos: `${ROOTS.DASHBOARD}/finanzas/egresos`,
      egresosNuevo: `${ROOTS.DASHBOARD}/finanzas/egresos/nuevo`,
    },
    ensenanzas: {
      root: `${ROOTS.DASHBOARD}/ensenanzas`,
      nuevo: `${ROOTS.DASHBOARD}/ensenanzas/nuevo`,
      editar: (id: number) => `${ROOTS.DASHBOARD}/ensenanzas/${id}/editar`,
    },
  },
};
