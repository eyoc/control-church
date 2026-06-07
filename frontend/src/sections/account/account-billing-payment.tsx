import type { CardProps } from '@mui/material/Card';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type Props = CardProps & {
  cards?: unknown[];
};

export function AccountBillingPayment({ cards, sx, ...other }: Props) {
  return (
    <Card sx={[{ my: 3 }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <CardHeader title="Método de pago" />
      <Typography sx={{ p: 3, color: 'text.secondary' }}>
        No disponible en esta versión.
      </Typography>
    </Card>
  );
}
