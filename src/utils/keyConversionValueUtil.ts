import TypeUtil from "@/utils/typeUtil.ts";
import PermissionUtil from "@/utils/permissionUtil.ts";

class KeyConversionValueUtil {

  public keyConversionValue(permissionKey: number): string {
    if (!permissionKey == null) {
      throw new ReferenceError("permissionKey is not defined");
    }
    if (!TypeUtil.isNumber(permissionKey)) {
      throw new TypeError("permissionKey must be a number");
    }
    let permissionUtil: PermissionUtil = new PermissionUtil(permissionKey);
    let str: string = "";
    if (permissionUtil.isInsert()) {
      str = "新增";
    }
    if (permissionUtil.isUpdate()) {
      str = "修改";
    }
    if (permissionUtil.isSelect()) {
      str = "查询";
    }
    if (permissionUtil.isDelete()) {
      str = "删除";
    }
    return str;
  }

  public keyConversionValueArray(permissionKey: number): string[] | String[] {
    if (!permissionKey == null) {
      throw new ReferenceError("permissionKey is not defined");
    }
    if (!TypeUtil.isNumber(permissionKey)) {
      throw new TypeError("permissionKey must be a number");
    }

    let permissionUtil: PermissionUtil = new PermissionUtil(permissionKey);
    let permissionKeyArray: string[] = [];
    permissionKeyArray.push(this.keyConversionValue(permissionKey));
    return permissionKeyArray;
  }



}

export default new KeyConversionValueUtil();
