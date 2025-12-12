import { atom } from 'recoil';

export const authState = atom({
  key: 'authState',
  default: {
    user: null,
    token: null,
    role: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }
});