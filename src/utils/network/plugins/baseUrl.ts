import { AjaxPlugin } from '@wlhy-web-lib/ajax';
import { Persistent } from '../../cache/persistent';
import { useGlobSetting } from '/@/hooks/setting';

export const baseUrl: AjaxPlugin = (next, config) => {
  const globSetting = useGlobSetting();
  if (!config.baseURL) {
    config.baseURL = Persistent.getLocal('debug')
      ? (Persistent.getLocal<string>('debug-api') as string)
      : globSetting.apiUrl;
  }

  return next();
};
