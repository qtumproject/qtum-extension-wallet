import type { DialogType } from '@metamask/snaps-sdk';
import { panel } from '@metamask/snaps-sdk';
import type { Component } from '@metamask/snaps-sdk/dist/types/ui';

export const getSnapDialog = async (type: DialogType, content: Component[]) => {
  return snap.request({
    method: 'snap_dialog',
    params: {
      type,
      content: panel(content),
    },
  });
};
