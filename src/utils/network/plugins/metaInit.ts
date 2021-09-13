import { AjaxPlugin } from '@wlhy-web-lib/ajax';
import { ComplexObject } from '@wlhy-web-lib/types';

export const metaInit: AjaxPlugin = (next, config) => {
  if (!config.meta) {
    config.meta = {} as ComplexObject;
  }

  return next();
};
