import StringUtil from "@/utils/stringUtil.ts";

class CodeUtil {

  private _timer: any = null;

  private static readonly CODE_END_TIME_KEY: string = 'CODE_END_TIME';

  // 未开始时显示的文本
  private _startText: string = '获取验证码';

  // 倒计时中显示的文本
  private _loadingText: string = 'X秒后重新获取验证码';

  // 倒计时结束后显示的文本
  private _endText: string = '重新获取验证码';

  // 结束时间 单位(s)
  private _endTime: number = 10;

  // 倒计时时间 单位(ms)
  private _countDownTime: number = 1000;

  // 加载状态
  private _loading: boolean = false;

  // 禁用状态
  private _disabled: boolean = false;

  // 是否持久化，也就是把倒计时时间存储在localstorage中 默认为true
  private _isDataPersistence: boolean = true;

  constructor() {
    const storedTime: number | null = this.getEndTimeFromLocalStorage();
    this._endTime = storedTime !== null ? storedTime : this._endTime;
  }

  /**
   * 设置未开始时展示的文本
   * @param startText 未开始时展示的文本
   */
  public setStartText(startText: string): void {
    this._startText = startText;
  }

  /**
   * 设置倒计时中展示的文本 （不带上一个英文字母则没有时间显示哦）
   * @param loadingText 倒计时中展示的文本
   */
  public setLoadingText(loadingText: string): void {
    this._loadingText = loadingText;
  }

  /**
   * 设置倒计时结束后展示的文本
   * @param endText 倒计时结束后展示的文本
   */
  public setEndText(endText: string): void {
    this._endText = endText;
  }

  /**
   * 设置倒计时时间 单位(s)
   * @param endTime 倒计时时间 单位(s) 不能小于1
   */
  public setEndTime(endTime: number): void {
    if (endTime < 1) {
      throw new RangeError("endTime cannot be less than 1");
    }
    this._endTime = endTime;
  }

  /**
   * 是否持久化，也就是把倒计时时间存储在localstorage中 默认为true
   * @param isDataPersistence 是否持久化
   */
  public setIsDataPersistence(isDataPersistence: boolean): void {
    this._isDataPersistence = isDataPersistence;
  }

  public getStartText(): string {
    return this._startText;
  }

  public getLoadingText(): string {
    return this._loadingText;
  }

  public getEndText(): string {
    return this._endText;
  }

  public getEndTime(): number {
    return this._endTime;
  }

  /**
   * 开启倒计时 需要传递一个回调函数，用于更新文本。
   * @param callback 回调函数 计时中返回倒计时时间的文本及按钮状态 如(loading, disabled)
   * @return {Promise<string>} 倒计时结束后返回倒计时结束时的文本。
   */
  public startCountDown(callback: (text: string, loadingStatus: LoadingStatus) => void): Promise<string> {
    let that = this;
    return new Promise((resolve): void => {
      let currentTime: number | null = that._endTime;
      if (that._isDataPersistence) {
        const storedTime: number | null = that.getEndTimeFromLocalStorage();
        if (storedTime != null) {
          currentTime = storedTime;
        }
      }
      if (that._timer != null) {
        that.stopCountDown();
      }
      that._loading = true;
      that._disabled = true;
      // @ts-ignore
      callback(that._loadingText.replace(/[a-zA-Z]/, currentTime != null ? currentTime.toString() : that._endTime), that.loadingStatus());
      that._timer = setInterval((): void => {
        if (currentTime != null && currentTime <= 0) {
          clearInterval(that._timer);
          resolve(that._endText);
          that._loading = false;
          that._disabled = false;
          callback(that._endText, that.loadingStatus());
          if (that._isDataPersistence) {
            that.deleteEndTimeFromLocalStorage();
          }
        } else {
          if (currentTime != null) {
            const newLoadingText: string = that._loadingText.replace(/[a-zA-Z]/, currentTime.toString());
            callback(newLoadingText, that.loadingStatus());
            that._loading = false;
            that._disabled = true;
            if (that._isDataPersistence) {
              // @ts-ignore
              that._endTime = currentTime;
              that.setEndTimeToLocalStorage();
            }
            // @ts-ignore
            currentTime--;
          }
        }
      }, this._countDownTime);
    });
  }

  /**
   * 获取按钮状态
   * @return {LoadingStatus} loading: 是否加载 disabled: 是否禁用
   */
  public loadingStatus(): LoadingStatus {
    return {
      loading: this._loading,
      disabled: this._disabled
    };
  }

  /**
   * 停止倒计时
   */
  public stopCountDown(): void {
    if (this._timer != null) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  /**
   * 把倒计时时间存储到缓存中
   * @private
   */
  private setEndTimeToLocalStorage(): void {
    localStorage.setItem(CodeUtil.CODE_END_TIME_KEY, this._endTime.toString());
  }

  /**
   * 从缓存中获取倒计时时间
   * @return {number | null} 返回倒计时时间 可能为null
   */
  public getEndTimeFromLocalStorage(): number | null {
    const endTime: string | null = localStorage.getItem(CodeUtil.CODE_END_TIME_KEY);
    if (endTime != null) {
      return Number(endTime);
    } else {
      return null;
    }
  }

  /**
   * 从缓存中删除倒计时时间
   * @private
   */
  private deleteEndTimeFromLocalStorage(): void {
    localStorage.removeItem(CodeUtil.CODE_END_TIME_KEY);
  }

}

export default CodeUtil;
