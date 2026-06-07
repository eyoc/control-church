'use client';

const _userPlans: any[] = []; const _userPayment: any[] = []; const _userInvoices: any[] = []; const _userAddressBook: any[] = [];

import { AccountBilling } from '../account-billing';

// ----------------------------------------------------------------------

export function AccountBillingView() {
  return (
    <AccountBilling
      plans={_userPlans}
      cards={_userPayment}
      invoices={_userInvoices}
      addressBook={_userAddressBook}
    />
  );
}
