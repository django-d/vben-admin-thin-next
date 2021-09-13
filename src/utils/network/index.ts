import { AjaxPlugin } from '@wlhy-web-lib/ajax';
import { Nullable, Tuple1, Action } from '@wlhy-web-lib/types';

import { onUnmounted } from 'vue';
import { agent$ } from './requestInitial';
import { Ajax, BuildHook } from './types';
import { AjaxInstance } from './ajaxInstance';

export const ajax: Ajax = (config) => new AjaxInstance(agent$, config);

export const buildHook: BuildHook =
  (config, useUnmounted = onUnmounted) =>
  () => {
    const canceler: Tuple1<Nullable<Action>> = { item1: null };

    const cancelAjax: AjaxPlugin = (next, config) => {
      canceler.item1 = config.meta?.canceler;
      return next();
    };

    useUnmounted(() => {
      if (canceler.item1) {
        canceler.item1();
      }
    });

    return new AjaxInstance(
      agent$.then((v) => v.add([cancelAjax])),
      config
    );
  };
