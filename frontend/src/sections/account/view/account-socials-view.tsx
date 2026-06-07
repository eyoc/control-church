'use client';

const _userAbout = { socialLinks: { facebook: '', instagram: '', linkedin: '', twitter: '' } };

import { AccountSocials } from '../account-socials';

// ----------------------------------------------------------------------

export function AccountSocialsView() {
  return <AccountSocials socialLinks={_userAbout.socialLinks} />;
}
