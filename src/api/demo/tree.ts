import { ajax } from '/@/utils/network';

enum Api {
  TREE_OPTIONS_LIST = '/tree/getDemoOptions',
}

/**
 * @description: Get sample options value
 */
export const treeOptionsListApi = (params?: Recordable) =>
  ajax<Recordable[]>({ url: Api.TREE_OPTIONS_LIST }).send({ params });
