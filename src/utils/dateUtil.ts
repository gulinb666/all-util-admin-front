class DateUtil {

  static getTimeGreeting(): string {
    const hour: number = new Date().getHours();
    if (hour < 12) {
      return "早上好";
    } else if (hour === 12 || hour < 14) {
      return "中午好";
    } else if (hour < 18) {
      return "下午好";
    } else {
      return "晚上好";
    }
  }

}

export default DateUtil;
