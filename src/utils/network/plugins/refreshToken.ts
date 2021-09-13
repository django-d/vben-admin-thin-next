import { AjaxPlugin } from '@wlhy-web-lib/ajax';

/**
 * @name 刷新token操作
 * @param next
 * @param config
 */
export const refreshToken: AjaxPlugin = async (next) => {
  // await sleep(10000);
  return next();
};
