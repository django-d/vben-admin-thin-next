import { AjaxPlugin } from '@wlhy-web-lib/ajax';
import { ComplexObject } from '@wlhy-web-lib/types';

import { isDevMode } from '../../env';

export const addHeaders = (func: () => ComplexObject) => {
  const RequestHeaderPlugin: AjaxPlugin = (next, config) => {
    if (config.headers) {
      config.headers = { ...config.headers, ...func() };
    } else {
      config.headers = func();
    }
    return next();
  };

  return RequestHeaderPlugin;
};

export const defaultRequestHeaders = addHeaders(() => {
  // FIXME: 临时写
  const headers = {} as ComplexObject;
  if (isDevMode()) {
  }
  // TODO: 添加全局的预置请求头

  return headers;
});
