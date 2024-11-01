import TimeUnitEnum from "@/enum/timeUnitEnum.ts";

class CookieUtil {

  /**
   * 获取cookie
   * @param key cookie的key
   * @return {string} 未找到返回空字符串否则返回值
   */
  static getCookie(key: any): string {

    const data: string = document.cookie;

    let startIndex: number = data.indexOf(key + '=');

    if (startIndex > -1) {

      startIndex = startIndex + key.length + 1;

      let endIndex: number = data.indexOf(';', startIndex);

      endIndex = endIndex < 0 ? data.length : endIndex;

      return decodeURIComponent(data.substring(startIndex, endIndex));
    } else {
      return ''
    }
  }

  /**
   * 设置cookie
   * @param key 键
   * @param value 值
   * @param time 存储时间
   * @param timeUnit 时间单位 默认毫秒，可选（天、小时、分钟、秒、毫秒）
   */
  static setCookie(key: string, value: string, time?: any, timeUnit?: string): void {
    const times = time;
    const cur: Date = new Date();
    if (timeUnit === TimeUnitEnum.DAY) {
      cur.setTime(cur.getTime() + times * 24 * 3600 * 1000);
    } else if (timeUnit === TimeUnitEnum.HOURS) {
      cur.setTime(cur.getTime() + times * 3600 * 1000);
    } else if (timeUnit === TimeUnitEnum.MINUTES) {
      cur.setTime(cur.getTime() + times * 60 * 1000);
    } else if (timeUnit === TimeUnitEnum.SECONDS) {
      cur.setTime(cur.getTime() + times * 1000);
    } else {
      cur.setTime(cur.getTime() + times);
    }
    document.cookie = key+'=' +encodeURIComponent(value) +';expires=' +(times === undefined ? '' : cur.toUTCString());
  }

  /**
   * 删除cookie
   * @param key 键
   */
  static deleteCookie(key: string): void {

    const data: string = CookieUtil.getCookie(key);

    if ((data as any) !== false) {
      this.setCookie(key, data, -1);
    }
  }

}

export default CookieUtil;
