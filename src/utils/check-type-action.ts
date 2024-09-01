import { PayloadAction } from '@reduxjs/toolkit';

export const isActionPending =
  (sliceName: string) => (action: PayloadAction) =>
    action.type.startsWith(`${sliceName}`) && action.type.endsWith('/pending')
      ? true
      : false;

export const isActionRejected =
  (sliceName: string) => (action: PayloadAction) =>
    action.type.startsWith(`${sliceName}`) && action.type.endsWith('/rejected')
      ? true
      : false;
