import { reUrl } from '@constants/patterns';

export const validateUrl = (v: string) => {
  return reUrl.test(v);
};
