import {FlatResponseData} from "~/packages/axios";
import {request} from "@/service/request";
import StringUtil from "@/utils/stringUtil.ts";

function adminLogin(options: Api.Admin.Admin): Promise<FlatResponseData<Api.Admin.Admin>> {
  if (options == null) {
    throw new ReferenceError("options is be must not null");
  }
  if (StringUtil.isEmpty(options.username)) {
    throw new ReferenceError("username is be must not null");
  }
  if (StringUtil.isEmpty(options.password)) {
    throw new ReferenceError("password is be must not null");
  }
  return request<Api.Admin.Admin>({
    url: '/admin/login',
    method: 'POST',
    data: options
  });
}

function getAdminInfoByToken(): Promise<FlatResponseData> {
  return request({
    url: "/admin/getAdminInfoByToken",
    method: 'GET'
  });
}

export {
  adminLogin,
  getAdminInfoByToken
};
