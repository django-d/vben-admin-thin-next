import { ComposeResult, isObject, isString } from '@wlhy-web-lib/shared';

import { ComplexObject } from './types';

export const getNext = (next: () => ComposeResult<ComplexObject>): Promise<ComplexObject> =>
  new Promise<ComplexObject>((r, e) => {
    try {
      r(next());
    } catch (error) {
      e(error as Error);
    }
  });

export const getEmptyPromise = () => new Promise<ComplexObject>(() => {});

export const sleep = (time: number) =>
  new Promise((r: Function) =>
    setTimeout(() => {
      r();
    }, time)
  );

export const isHttpUrl = (url: string | undefined) => {
  if (!url) return false;
  return url.startsWith('http');
};

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';

/**
 * @description: 格式化请求参数时间
 */
export function formatRequestDate(params: any) {
  for (const key in params) {
    if (params[key] && params[key]._isAMomentObject) {
      params[key] = params[key].format(DATE_TIME_FORMAT);
    }
    if (isString(key)) {
      const value = params[key];
      if (value) {
        try {
          params[key] = isString(value) ? value.trim() : value;
        } catch (error) {
          throw new Error(error as string);
        }
      }
    }
    if (isObject(params[key])) {
      formatRequestDate(params[key]);
    }
  }
}
