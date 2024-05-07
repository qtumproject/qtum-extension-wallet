import type { DialogType, Component } from '@metamask/snaps-sdk';
import { panel } from '@metamask/snaps-sdk';

export const getSnapDialog = async (type: DialogType, content: Component[]) => {
  return snap.request({
    method: 'snap_dialog',
    params: {
      type,
      content: panel(content),
    },
  });
};
