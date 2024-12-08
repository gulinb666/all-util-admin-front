import { request } from '../request';
import {FlatResponseData} from "~/packages/axios";
import StringUtil from "@/utils/stringUtil.ts";


function getCaptcha(codeId: string | String): Promise<FlatResponseData<Api.Captcha.Captcha>> {
  let data = null;
  if (StringUtil.isNotEmpty(codeId)) {
    data = {
      codeId: codeId
    };
  }
  return request<Api.Captcha.Captcha>({
    url: "/admin/captcha/getImageVerifyCode",
    method: "GET",
    params: data
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
    url: '/admin/captcha/verifyImageVerifyCode',
    method: "GET",
    params: {
      codeId: codeId,
      code: code
    }
  });
}

export {
  getCaptcha,
  verifyImageVerifyCode
};
