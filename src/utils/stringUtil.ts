class StringUtil {

  /**
   * 判断字符串是否为空
   * @param str 字符串
   * @returns boolean 字符串为空返回true，否则返回false
   */
  public static isEmpty(str: string | String): boolean | Boolean {
    return str == null || str.trim() === "" || str.trim().length <= 0;
  }

  /**
   * 判断字符串是否不为空
   * @param str
   * @return boolean 字符串不为空返回true，否则返回false
   */
  public static isNotEmpty(str: string | String): boolean | Boolean {
    return !StringUtil.isEmpty(str);
  }

}

export default StringUtil;
