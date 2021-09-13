import { ComposePlugin } from '@wlhy-web-lib/shared';
import { AxiosRequestConfig } from 'axios';

export interface IAjaxInstance<TResult, TParams, TData> {
  add: Function;
  exec: Function;
  send: (config?: { data?: TData; params?: TParams }) => Promise<TResult>;
  sendQuery: Function;
}

export interface ComplexObject {
  [key: string]: any;
}

export interface AjaxRequestMeta {
  joinParamsToUrl?: boolean;
  isTransformRequestResult?: boolean;
  upload?: boolean;
  form?: boolean;
  joinPrefix?: boolean;
  errorMessageMode?: 'none' | 'modal';
  [key: string]: any;
}

export interface AjaxConfig extends AxiosRequestConfig {
  timestamp?: number;
  meta?: AjaxRequestMeta;
}

export interface TAjaxConfig<TParams, TData> extends AjaxConfig {
  params?: TParams;
  data?: TData;
}

export interface ResponseObject extends ComplexObject {
  data: any;
  status: number;
  statusText: string;
  config: AjaxConfig;
  headers: ComplexObject;
}

export type AjaxPluginType = ComposePlugin<ComplexObject, AjaxConfig>;

export interface AjaxPluginInfo {
  name: string;
  instance: AjaxPluginType;
}

export type PluginsConvert = (plugins: AjaxPluginInfo[]) => AjaxPluginType[];

export type Ajax = <
  TResult = {},
  TParams extends ComplexObject = {},
  TData extends ComplexObject = {}
>(
  config: TAjaxConfig<TParams, TData> | string,
  pluginsConvert?: PluginsConvert,
  suffixPluginsConvert?: PluginsConvert
) => IAjaxInstance<TResult, TParams, TData>;

export type BuildHook = <
  TResult,
  TData extends ComplexObject = {},
  TParams extends ComplexObject = {}
>(
  config: TAjaxConfig<TParams, TData> | string,
  useUnmounted?: OnUnmountCallback
) => () => IAjaxInstance<TResult, TParams, TData>;
