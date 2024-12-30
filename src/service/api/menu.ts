import {FlatResponseData} from "~/packages/axios";
import {request} from "@/service/request";

function getMenuList(): Promise<FlatResponseData<Api.Menu.Menu>> {
  return request<Api.Menu.Menu>({
    url: '/menu/getMenuList',
    method: "GET"
  });
}

export {
  getMenuList
}
