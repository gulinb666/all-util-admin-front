import { request } from '../request';
import {FlatResponseData} from "~/packages/axios";
import StringUtil from "@/utils/stringUtil.ts";

function adminLoginSendEmailVerifyCode(email: string, key?: string): Promise<FlatResponseData<Api.Email.SendEmailVerifyCode>> {
  if (StringUtil.isEmpty(email)) {
    throw new ReferenceError("email is be must not null");
  }
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
  if (StringUtil.isEmpty(code)) {
    throw new ReferenceError("code is be must not null");
  }
  if (StringUtil.isEmpty(key)) {
    throw new ReferenceError("the email verification code has expired");
  }
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
