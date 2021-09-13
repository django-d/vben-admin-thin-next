import { AjaxPluginFullConfig } from '@wlhy-web-lib/ajax';
import { request, buildBeforePlugin, buildAfterPlugin } from '@wlhy-web-lib/ajax';

import { baseUrl } from './plugins/baseUrl';
import { metaInit } from './plugins/metaInit';
import { refreshToken } from './plugins/refreshToken';
import { defaultMethod } from './plugins/defaultMethod';
import { defaultRequestHeaders } from './plugins/requestHeaders';
import { useMessage } from '/@/hooks/web/useMessage';
import { useGlobSetting } from '/@/hooks/setting';
import { Persistent } from '../cache/persistent';
import { TOKEN_KEY } from '/@/enums/cacheEnum';
import { useUserStoreWithOut } from '/@/store/modules/user';

const { createMessage, createErrorModal } = useMessage();

const globalSetting = useGlobSetting();

const plugins: AjaxPluginFullConfig[] = [
  { desc: '初始化请求中的 meta 对象：需要在最早初始化', order: -10500, executor: metaInit },
  { desc: '初始化请求的请求方法：没有设置时置为 POST', order: -10450, executor: defaultMethod },
  {
    desc: '添加一些默认的请求头：这些请求头通常是实际业务需要的',
    order: -10400,
    executor: defaultRequestHeaders,
  },
  { desc: 'refreshToken：实际业务需要', order: -10300, executor: refreshToken },
  { desc: 'baseUrl：添加 Ajax 请求的基础前缀', order: -10200, executor: baseUrl },
  {
    desc: '基础业务前置插件',
    order: -10150,
    executor: buildBeforePlugin({
      apiUrl: globalSetting.apiUrl,
      urlPrefix: globalSetting.urlPrefix,
    }),
  },
  {
    desc: '捕捉ajax错误',
    order: 10030,
    executor: (error, config) => {
      return error().catch((error) => {
        if (error === '__ERROR_RESULT__') {
          return Promise.reject({ sentryIgnore: true, url: config.url, params: config.data || {} });
        }
        return Promise.reject(error);
      });
    },
  },
  {
    desc: '基础业务后置插件',
    order: 10050,
    executor: buildAfterPlugin({
      /**
       * 成功的指示状态码
       */
      successCode: 200,
      /**
       * 根据不同的错误码和描述信息执行某些操作，属于业务异常的处理都在这里订阅
       */
      checkErrorCode(code, message) {
        const userStore = useUserStoreWithOut();
        let msg = message;
        let onOk = async () => {};
        switch (code) {
          case '401':
            onOk = () => userStore.logout(true);
            msg = '该账号需要重新登录';
            break;
        }
        if (msg) {
          // errorMessageMode=‘modal’的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
          createErrorModal({ title: '登录异常', content: msg, onOk });
        }
      },
      /**
       * 根据不同的 HTTP 状态码和描述信息执行某些操作：
       * 额外的特殊状态码，由组件库定义：
       * :timeout => 表示超时
       * :networkError => 表示网络异常
       */
      checkHttpErrorCode(code, msg) {
        const userStore = useUserStoreWithOut();
        if (code === ':networkError') {
          createErrorModal({
            title: '网络异常',
            content: '请检查您的网络连接是否正常!',
          });
          return;
        }

        createMessage.error(msg);
        switch (code) {
          case '401':
            userStore.logout(true);
            break;
        }
      },
    }),
  },

  {
    desc: 'defaultToken',
    order: -10130,
    executor: (next, config) => {
      const token = Persistent.getLocal(TOKEN_KEY);
      // jwt token
      if (config.headers) {
        config.headers.Authorization = token;
      } else {
        config.headers = { Authorization: token };
      }

      return next();
    },
  },
];

export const agent$ = request.attach(plugins);
