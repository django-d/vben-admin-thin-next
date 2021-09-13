import { AjaxPlugin, AjaxMethods } from '@wlhy-web-lib/ajax';

export const defaultMethod: AjaxPlugin = (next, config) => {
  if (!config.method) {
    config.method = AjaxMethods.POST;
  }

  return next();
};
