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
    },
    asistencia: {
      root: `${ROOTS.DASHBOARD}/asistencia`,
      nuevo: `${ROOTS.DASHBOARD}/asistencia/nuevo`,
    },
    finanzas: {
      root: `${ROOTS.DASHBOARD}/finanzas`,
      ingresos: `${ROOTS.DASHBOARD}/finanzas/ingresos`,
      egresos: `${ROOTS.DASHBOARD}/finanzas/egresos`,
    },
    ensenanzas: {
      root: `${ROOTS.DASHBOARD}/ensenanzas`,
      nuevo: `${ROOTS.DASHBOARD}/ensenanzas/nuevo`,
    },
  },
};
