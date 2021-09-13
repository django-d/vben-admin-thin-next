import { AjaxAgent, AjaxConfig, AjaxPlugin } from '@wlhy-web-lib/ajax';

import { IAjaxInstance, AjaxPluginType, ComplexObject, TAjaxConfig } from './types';

export class AjaxInstance<TResult, TParams extends ComplexObject, TData extends ComplexObject>
  implements IAjaxInstance<TResult, TParams, TData>
{
  private config: TAjaxConfig<TParams, TData>;

  constructor(private agent: Promise<AjaxAgent>, config: TAjaxConfig<TParams, TData> | string) {
    this.config =
      typeof config === 'string' ? ({ url: config } as TAjaxConfig<TParams, TData>) : config;
  }

  add(...plugins: AjaxPluginType[]) {
    const newAgent = this.agent.then((v) => v.add(plugins as unknown[] as AjaxPlugin[]));

    return new AjaxInstance<TResult, TParams, TData>(newAgent, this.config);
  }

  exec(config?: TAjaxConfig<TParams, TData>) {
    const currentConfig = !config ? ({} as TAjaxConfig<TParams, TData>) : config;
    this.config.timestamp = Date.now();
    return this.agent.then((v) => {
      const parameter = {
        ...this.config,
        ...currentConfig,
        params: { ...this.config.params, ...currentConfig.params },
        data: currentConfig.data || {},
      } as AjaxConfig;
      return v.exec(parameter);
    }) as Promise<unknown> as Promise<TResult>;
  }

  send(data: { data?: TData; params?: TParams } = {}): Promise<TResult> {
    return this.exec(data as TAjaxConfig<TParams, TData>);
  }

  sendQuery(query?: TParams) {
    return this.exec({ params: query, method: 'GET' } as TAjaxConfig<TParams, TData>);
  }
}
