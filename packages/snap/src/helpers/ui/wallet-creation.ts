import {
  copyable,
  DialogType,
  divider,
  heading,
  text,
} from '@metamask/snaps-sdk';

import { getSnapDialog } from '@/helpers';

// eslint-disable-next-line
export async function showWalletCreatedSnapDialog(
  ethAddr: string,
  qtumAddr: string,
) {
  return await getSnapDialog(DialogType.Confirmation, [
    heading('Your Wallet'),
    divider(),

    text('Your eth address:'),
    copyable({
      value: ethAddr,
    }),

    text('Your qtum address:'),
    copyable({
      value: qtumAddr,
    }),
  ]);
}
