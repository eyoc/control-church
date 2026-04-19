import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  user: icon('ic-user'),
  banking: icon('ic-banking'),
  calendar: icon('ic-calendar'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  booking: icon('ic-booking'),
  course: icon('ic-course'),
  folder: icon('ic-folder'),
};

// ----------------------------------------------------------------------

export const navData: NavSectionProps['data'] = [
  {
    subheader: 'General',
    items: [
      {
        title: 'Resumen',
        path: paths.dashboard.root,
        icon: ICONS.dashboard,
      },
    ],
  },
  {
    subheader: 'Congregación',
    items: [
      {
        title: 'Miembros',
        path: paths.dashboard.miembros.root,
        icon: ICONS.user,
      },
      {
        title: 'Grupos',
        path: paths.dashboard.grupos.root,
        icon: ICONS.booking,
      },
      {
        title: 'Asistencia',
        path: paths.dashboard.asistencia.root,
        icon: ICONS.calendar,
      },
    ],
  },
  {
    subheader: 'Administración',
    items: [
      {
        title: 'Finanzas',
        path: paths.dashboard.finanzas.root,
        icon: ICONS.banking,
        children: [
          { title: 'Resumen', path: paths.dashboard.finanzas.root },
          { title: 'Ingresos', path: paths.dashboard.finanzas.ingresos },
          { title: 'Egresos', path: paths.dashboard.finanzas.egresos },
        ],
      },
      {
        title: 'Enseñanzas',
        path: paths.dashboard.ensenanzas.root,
        icon: ICONS.course,
      },
    ],
  },
];
