import { atom } from 'recoil';

export const teamState = atom({
  key: 'teamState',
  default: {
    members: [],
    pendingInvites: [],
    loading: false,
    error: null
  }
});