import { GetUserInfoModel, LoginParams, LoginResultModel } from './model/userModel';
import { ajax } from '/@/utils/network';

enum Api {
  Login = '/login',
  Logout = '/logout',
  GetUserInfo = '/getUserInfo',
  GetPermCode = '/getPermCode',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams) {
  return ajax<LoginResultModel>({ url: Api.Login }).send({ params });
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return ajax<GetUserInfoModel>({ url: Api.GetUserInfo, method: 'GET' }).send();
}

export function getPermCode() {
  return ajax<string[]>({ url: Api.GetUserInfo, method: 'GET' }).send();
}

export function doLogout() {
  return ajax<string[]>({ url: Api.Logout, method: 'GET' }).send();
}
