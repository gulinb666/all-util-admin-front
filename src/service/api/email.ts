import { request } from '../request';
import {FlatResponseData} from "~/packages/axios";
import StringUtil from "@/utils/stringUtil.ts";

function adminLoginSendEmailVerifyCode(email: string, key?: string): Promise<FlatResponseData<Api.Email.SendEmailVerifyCode>> {
  return request<Api.Email.SendEmailVerifyCode>({
    url: "/admin/email/sendEmailVerifyCode",
    method: "POST",
    params: {
      email: email,
      // @ts-ignore
      key: StringUtil.isEmpty(key) ? "" : key
    }
  });
}

function adminLoginVerifyEmailCode(key: string, code: string): Promise<FlatResponseData<Api.Email.VerifyEmailCode>>  {
  return request<Api.Email.VerifyEmailCode>({
    url: "/admin/email/verifyEmailVerifyCode",
    method: "POST",
    params: {
      key: key,
      code: code
    }
  });
}

export {
  adminLoginSendEmailVerifyCode,
  adminLoginVerifyEmailCode
};
