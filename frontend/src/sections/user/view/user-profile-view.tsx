'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function UserProfileView() {
  const { user } = useAuthContext();

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Profile"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.root },
          { name: user?.displayName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ p: 3 }}>
        <Typography variant="h6">{user?.displayName}</Typography>
        <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
      </Card>
    </DashboardContent>
  );
}
