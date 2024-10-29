import { request } from '../request';
import {FlatResponseData} from "~/packages/axios";
import StringUtil from "@/utils/stringUtil.ts";


function getCaptcha(codeId: string | String): Promise<FlatResponseData<Api.Captcha.Captcha>> {
  let url: string = "";
  if (StringUtil.isNotEmpty(codeId)) {
    url = `/admin-feign/captcha/getImageVerifyCode?codeId=${codeId}`;
  } else {
    url = '/admin-feign/captcha/getImageVerifyCode';
  }
  return request<Api.Captcha.Captcha>({
    url: url,
    method: "GET"
  });
}

function verifyImageVerifyCode(codeId: string | String, code: string | String): Promise<FlatResponseData<Api.Captcha.VerifyCaptcha>> {
  if (StringUtil.isEmpty(codeId)) {
    throw new ReferenceError("codeId is be must not null");
  }
  if (StringUtil.isEmpty(code)) {
    throw new ReferenceError("code is be must not null");
  }
  return request<Api.Captcha.VerifyCaptcha>({
    url: `/admin-feign/captcha/verifyImageVerifyCode?codeId=${codeId}&code=${code}`,
    method: "GET"
  });
}

export {
  getCaptcha,
  verifyImageVerifyCode
};
