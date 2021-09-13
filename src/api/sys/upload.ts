import { request } from '@wlhy-web-lib/ajax';
import { UploadFileParams } from '/#/axios';
import { useGlobSetting } from '/@/hooks/setting';

const { uploadUrl = '' } = useGlobSetting();

/**
 * @description: Upload interface
 */
export function uploadApi(params: UploadFileParams) {
  return request.upload(uploadUrl, params);
}
