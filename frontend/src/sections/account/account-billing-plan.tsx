import type { CardProps } from '@mui/material/Card';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type Props = CardProps & {
  cardList?: unknown[];
  addressBook?: unknown[];
  plans?: unknown[];
};

export function AccountBillingPlan({ sx, ...other }: Props) {
  return (
    <Card sx={sx} {...other}>
      <CardHeader title="Plan" />
      <Typography sx={{ p: 3, color: 'text.secondary' }}>
        No disponible en esta versión.
      </Typography>
    </Card>
  );
}
