import { getMenuListResultModel } from './model/menuModel';
import { ajax } from '/@/utils/network';

enum Api {
  GetMenuList = '/getMenuList',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return ajax<getMenuListResultModel>({ url: Api.GetMenuList }).send();
};
