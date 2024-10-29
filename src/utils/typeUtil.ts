import StringUtil from "@/utils/stringUtil.ts";

class TypeUtil {

  /**
   * 判断是否是为字符串
   * @param str 字符串
   * @return boolean 为字符串返回true 否则返回false
   */
  public isString(str: string | String): boolean | Boolean {
    if (StringUtil.isEmpty(str)) {
      throw new ReferenceError("str is not defined");
    }
    let isTypeString: boolean = false;
    if (typeof str === 'string') {
      isTypeString = true;
    }
    return isTypeString;
  }

  /**
   * 判断是否是为数字
   * @param num 数字
   * @return boolean 为数字返回true 否则返回false
   */
  public isNumber(num: number | Number): boolean | Boolean  {
    if (num == null) {
      throw new ReferenceError("num is not defined");
    }
    let isTypeNum: boolean = false;
    if (typeof num === "number") {
      isTypeNum = true;
    }
    return isTypeNum;
  }

}

export default new TypeUtil();
