import {FlatResponseData} from "~/packages/axios";
import {request} from "@/service/request";
import StringUtil from "@/utils/stringUtil.ts";

function getRole(userId: string): Promise<FlatResponseData<Api.Role.Role>> {
  if (StringUtil.isEmpty(userId)) {
    throw new ReferenceError("userId is be must not null");
  }
  return request<Api.Role.Role>({
    url: '/role/getRole',
    method: "GET",
    params: {
      roleId: userId
    }
  });
}

export {
  getRole
};
